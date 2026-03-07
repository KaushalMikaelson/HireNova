"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/app/lib/schema";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Industry = {
    id: string;
    name: string;
    subIndustries: string[];
};

const OnboardingForm = ({ industries }: { industries: Industry[] }) => {

    const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, setValue, watch, } = useForm({
        resolver: zodResolver(onboardingSchema),
    })

    const onSubmit = async (values: any) => {
        console.log(values);
    }

    const watchIndustry = watch("industry");
    return (
        <div className="flex  justify-center items-center bg-background">
            <Card className="w-full max-w-lg mt-10 mx-2">
                <CardHeader>
                    <CardTitle className="gradient-title text-4xl" >Complete Your Profile</CardTitle>
                    <CardDescription>Select your industry to get personalized career insights and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} >
                        <div className="space-y-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Select
                                onValueChange={(value) => {
                                    setValue("industry", value);
                                    setSelectedIndustry(
                                        industries.find((ind) => ind.id === value) || null
                                    );
                                    setValue("subIndustry", "");
                                }}
                            >
                                <SelectTrigger id="industry">
                                    <SelectValue placeholder="Select an Industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {industries.map((ind) => (
                                        <SelectItem value={ind.id} key={ind.id}>
                                            {ind.name}
                                        </SelectItem>
                                    ))}

                                </SelectContent>
                            </Select>
                            {errors.industry && (
                                <p className="text-red-500 text-sm">{errors.industry.message}</p>
                            )}
                        </div>

                        {watchIndustry && (
                            <div className="space-y-2">
                                <Label htmlFor="subIndustry">Specialization</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setValue("industry", value);
                                    }}
                                >
                                    <SelectTrigger id="subIndustry">
                                        <SelectValue placeholder="Select an Sub-Industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedIndustry?.subIndustries.map((ind: string) => {
                                            return (
                                                <SelectItem value={ind} key={ind}>
                                                    {ind}
                                                </SelectItem>
                                            )
                                        })}

                                    </SelectContent>
                                </Select>
                                {errors.subIndustry && (
                                    <p className="text-red-500 text-sm">{errors.subIndustry.message}</p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="experience">Years of Experience</Label>
                            <Input
                                id="experience"
                                type="number"
                                min={0}
                                max={50}
                                placeholder="Enter your experience"
                                {...register("experience")}
                            />
                            {errors.experience && (
                                <p className="text-red-500 text-sm">{errors.experience.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="skills">Skills</Label>
                            <Input
                                id="skills"
                                placeholder="e.g., Python, Java, React, Node.js, etc."
                                {...register("skills")}
                            />
                            <p className="text-muted-foreground text-sm">
                                Enter your skills separated by commas
                            </p>
                            {errors.skills && (
                                <p className="text-red-500 text-sm">{errors.skills.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Professional Bio</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell us about your professional background..."
                                className="h-32"
                                {...register("bio")}
                            />

                            {errors.bio && (
                                <p className="text-red-500 text-sm">{errors.bio.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full">
                            Complete Profile
                        </Button>
                    </form>
                </CardContent>


            </Card>

        </div>



    );
}

export default OnboardingForm;