"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getUserCareerProfile() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: { industryInsight: true },
    });

    if (!user) throw new Error("User not found");
    return user;
}

export async function generateCareerAdvice(question: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: { industryInsight: true },
    });
    if (!user) throw new Error("User not found");

    const context = `
    User Profile:
    - Industry: ${user.industry || "Not specified"}
    - Experience: ${user.experience || "Not specified"}
    - Skills: ${user.skills?.join(", ") || "Not specified"}
    - Bio: ${user.bio || "Not specified"}
    - Market Outlook: ${user.industryInsight?.marketOutlook || "Unknown"}
    - Industry Demand: ${user.industryInsight?.demandLevel || "Unknown"}
    - Key Industry Trends: ${user.industryInsight?.keyTrends?.join(", ") || "Unknown"}
    `;

    const prompt = `You are an expert career coach. Based on this user's profile, answer their career question with personalized, actionable advice.

${context}

User Question: ${question}

Provide a concise, practical response (3-5 paragraphs max). Be specific, encouraging, and reference their background when relevant.`;

    const result = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
    });

    return result.choices[0].message.content ?? "";
}

export async function generateCareerRoadmap() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: { industryInsight: true },
    });
    if (!user) throw new Error("User not found");

    const prompt = `You are an expert career strategist. Generate a personalized 12-month career roadmap for this professional.

User Profile:
- Industry: ${user.industry || "Technology"}
- Experience: ${user.experience || "Not specified"}
- Current Skills: ${user.skills?.join(", ") || "Not specified"}
- Bio: ${user.bio || "Not specified"}
- Recommended Skills to Learn: ${user.industryInsight?.recommendedSkills?.join(", ") || "Not specified"}
- Key Industry Trends: ${user.industryInsight?.keyTrends?.join(", ") || "Not specified"}

Return ONLY a JSON array (no markdown, no extra text) in this format:
[
  {
    "quarter": "Q1 (Months 1-3)",
    "title": "string",
    "goals": ["goal1", "goal2", "goal3"],
    "skills": ["skill1", "skill2"],
    "milestone": "string"
  }
]

Include exactly 4 quarters. Be specific and tailored to the user's background.`;

    const result = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
    });

    const text = result.choices[0].message.content!;
    const cleaned = text.replace(/```(?:json)?\s*\n?/g, "").trim();
    return JSON.parse(cleaned);
}

export async function generateSkillGapAnalysis() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: { industryInsight: true },
    });
    if (!user) throw new Error("User not found");

    const prompt = `Analyze the skill gap for this professional and provide actionable recommendations.

User Profile:
- Industry: ${user.industry || "Technology"}
- Experience: ${user.experience || "Not specified"}
- Current Skills: ${user.skills?.join(", ") || "Not specified"}
- Industry Top Skills: ${user.industryInsight?.topSkills?.join(", ") || "Not specified"}
- Recommended Skills: ${user.industryInsight?.recommendedSkills?.join(", ") || "Not specified"}

Return ONLY a JSON object (no markdown, no extra text):
{
  "strengths": [{"skill": "string", "level": number, "note": "string"}],
  "gaps": [{"skill": "string", "priority": "HIGH" | "MEDIUM" | "LOW", "timeToLearn": "string", "resources": ["resource1"]}],
  "overallScore": number,
  "summary": "string"
}

strengths: max 4 items, level 0-100.
gaps: max 5 items, most important missing skills.
overallScore: 0-100 readiness score.`;

    const result = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
    });

    const text = result.choices[0].message.content!;
    const cleaned = text.replace(/```(?:json)?\s*\n?/g, "").trim();
    return JSON.parse(cleaned);
}
