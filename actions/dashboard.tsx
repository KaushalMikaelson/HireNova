"use server"

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma"

import Groq from "groq-sdk";


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateAIInsights = async (industry: string) => {
    const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "HIGH" | "MEDIUM" | "LOW",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

    const result = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
    });

    const text = result.choices[0].message.content!;
    const cleanedText = text.replace(/```(?:json)?\s*\n?/g, "").trim();
    return JSON.parse(cleanedText);
}

export async function getIndustryInsights() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: {
            industryInsight: true,
        },
    })

    if (!user) throw new Error("User not found");

    if (!user.industry) {
        return null;
    }

    if (!user.industryInsight) {
        const insights = await generateAIInsights(user.industry);

        const industryInsight = await db.industryInsight.create({
            data: {
                industry: user.industry,
                ...insights,
                nextUpdate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        })
        return industryInsight;
    }
    return user.industryInsight;

}

import { revalidatePath } from "next/cache";

export async function updateUserIndustry(newIndustry: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    if (user.industry === newIndustry) return { success: true };

    try {
        await db.$transaction(
            async (tx) => {
                let industryInsight = await tx.industryInsight.findUnique({
                    where: { industry: newIndustry },
                });

                if (!industryInsight) {
                    const insights = await generateAIInsights(newIndustry);
                    industryInsight = await tx.industryInsight.create({
                        data: {
                            industry: newIndustry,
                            ...insights,
                            nextUpdate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        },
                    });
                }

                await tx.user.update({
                    where: { id: user.id },
                    data: { industry: newIndustry },
                });
            },
            { timeout: 15000 }
        );

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        console.error("Error changing industry:", error.message);
        throw new Error("Failed to change industry");
    }
}
