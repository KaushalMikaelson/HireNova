"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma"

export async function updateUser(data) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    try {
        //find if the industry exists
        const result = await db.$transaction(
            async (tx) => {
                let industryInsight = await tx.industryInsight.findUnique({
                    where: { industry: data.industry },
                });

                if (!industryInsight) {
                    industryInsight = await tx.industryInsight.create({
                        data: {
                            industry: data.industry,
                            salaryRanges: [],
                            growthRate: 0,
                            demandLevel: "MEDIUM",
                            topSkills: [],
                            marketOutlook: "NEUTRAL",
                            keyTrends: [],
                            nextUpdate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //1 week from now
                        },
                    });
                }

                //update user
                const updatedUser = await tx.user.update({
                    where: { id: user.id },
                    data: {
                        industry: data.industry,
                        experience: data.experience?.toString(),
                        bio: data.bio,
                        skills: data.skills,
                    },
                });

                return { user: updatedUser, industryInsight };

            }, {
            timeout: 10000,
        });
        return { success: true, ...result };
    } catch (error) {
        console.error("Error updating user and industry:", error.message);
        return { success: false, error: error.message };
    }
}

export async function getUserOnboardingStatus() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },

            select: {
                industry: true,
            }
        });

        return {
            isOnboarded: !!user?.industry,
        };

    } catch (error) {
        console.error("Error getting user onboarding status:", error.message);
        throw new Error("Failed to get user onboarding status");
    }
}