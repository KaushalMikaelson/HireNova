"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateCoverLetter(data: { companyName: string; jobTitle: string; jobDescription: string }) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const prompt = `
        Write a professional, compelling cover letter for the position of ${data.jobTitle} at ${data.companyName}.
        
        Job Description:
        ${data.jobDescription}

        User Background:
        - Industry: ${user.industry || "Not specified"}
        - Years of Experience: ${user.experience || "Not specified"}
        - Skills: ${user.skills ? user.skills.join(", ") : "Not specified"}
        - Brief Bio: ${user.bio || "Not specified"}

        Write the cover letter in a highly professional, engaging tone. Do not include placeholders for the user's name or address at the top, just format it like a standard letter body starting with a clear salutation (e.g., Dear Hiring Manager,) and ending with a professional sign-off but NO signature placeholders. Just return the pure text of the letter, no conversational filler or intro/outro from the AI.
    `;

    try {
        const result = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
        });

        const letterContent = result.choices[0].message.content!;

        const coverLetter = await db.coverLetter.create({
            data: {
                userId: user.id,
                companyName: data.companyName,
                jobTitle: data.jobTitle,
                jobDescription: data.jobDescription,
                content: letterContent,
            },
        });

        return { success: true, id: coverLetter.id, content: letterContent };
    } catch (error: any) {
        console.error("Cover letter generation failed:", error);
        return { success: false, error: error.message };
    }
}

export async function getCoverLetter(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    
    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const coverLetter = await db.coverLetter.findUnique({
        where: { id, userId: user.id },
    });
    
    return coverLetter;
}

export async function updateCoverLetter(id: string, content: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    
    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const updated = await db.coverLetter.update({
        where: { id, userId: user.id },
        data: { content },
    });
    
    return updated;
}
