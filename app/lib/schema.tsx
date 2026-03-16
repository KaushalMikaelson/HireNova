import { z } from "zod";

export const onboardingSchema = z.object({
    industry: z.string({
        message: "Please select an industry.",
    }),
    subIndustry: z.string({
        message: "Please select a sub industry.",
    }),
    bio: z.string().max(500).optional(),
    experience: z.string()
    .transform((val) => parseInt(val, 10))
    .pipe(
        z.number().min(0, "Experience must be at least 0 years.").max(50, "Experience must be at most 50 years.")
    ),
    skills: z.string().transform((val) => 
    val ?
    val.split(",").map((skill) => skill.trim())
    .filter(Boolean)
    : undefined
    ),

})

export const contactSchema = z.object({
    email: z.string().email("Invalid email address."),
    mobile: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
})

export const entrySchema = z.object({
    title: z.string().min(2, "Title is required."),
    organization: z.string().min(2, "Organization is required."),
    
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().optional(),
    description: z.string().min(10, "Description must be at least 10 characters."),
    current: z.boolean().default(false),
}).refine((data) =>{
    if(!data.current && !data.endDate){
        return false;
    }
    return true;
}, {
    message: "End date is required when current is false.",
    path: ["endDate"],
})

export const resumeSchema = z.object({
    contactInfo: contactSchema,
    experience: z.array(entrySchema),
    education: z.array(entrySchema),
    projects: z.array(entrySchema),
    certifications: z.array(entrySchema),
    skills: z.string().min(1, "Skills are required."),
    summary: z.string().min(10, "Summary must be at least 10 characters.").optional(),
})