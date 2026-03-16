"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import Groq from "groq-sdk";


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function saveResume(content:string){

    const {userId} = await auth();
    if(!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where:{
            clerkUserId: userId,
        },
        select:{
            id:true,
        }
    })
    if(!user) throw new Error("User not found");

    try {
        const resume = await db.resume.upsert({
            where:{
                userId: user.id,
            },
            update:{
                content,
            },
            create:{
                userId: user.id,
                content,
            }
        })
        revalidatePath("/resume");
        return resume;
    } catch (error) {
        console.log("Error saving resume:", error);
        return {success:false, error:"Failed to save resume"};
    }
}

export async function getResume(){
    const {userId} = await auth();
    if(!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where:{
            clerkUserId: userId,
        },
        select:{
            id:true,
        }
    })
    if(!user) throw new Error("User not found");

    return await db.resume.findUnique({
            where:{
                userId: user.id,
            },
        })
}

export async function improveWithAI({ current, type }: { current: string; type: string }){
    const {userId} = await auth();
    if(!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where:{
            clerkUserId: userId,
        },
        select:{
            id:true,
            industry: true,
        }
    })
    if(!user) throw new Error("User not found");

   const prompt=`
   As an expert resume writer , improve the following ${type} 
    description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"
    
    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant skills and achievements
    4. Keep it concise and professional (max 3-4 sentences)
    5. Tailor to ${user.industry} industry standards
    6. Use ATS-friendly keywords
    7. Maintain a confident and professional tone
    

    Format the response as a single paragraph without any additional test or explanations.
   `;
    
   try {
    const result = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: prompt },
            { role: "user", content: current },
        ],
    });
   
    const improvedContent = result.choices[0].message.content;
    return improvedContent;

   } catch (error: any) {
    console.error("Error improving resume:", error?.message || error);
    console.error("Full error:", JSON.stringify(error, null, 2));
    throw new Error(error?.message || "Failed to improve resume");
   }
}