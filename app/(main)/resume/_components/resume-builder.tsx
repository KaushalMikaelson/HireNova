"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Download, Loader2, Save, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/app/lib/schema";
import { z } from "zod";
import { saveResume } from "@/actions/resume";
import useFetch from "@/hooks/use-fetch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EntryForm from "./entry-form";
import { Edit } from "lucide-react";
import { Monitor } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import htmlToPdf from "html2pdf.js/dist/html2pdf.min.js";
import { toast } from "sonner";


const ResumeBuilder = ({ initialContent }: { initialContent: string }) => {

    const [activeTab, setActiveTab] = useState("edit");
    const [resumeMode, setResumeMode] = useState("preview");
    const [previewContent, setPreviewContent] = useState(initialContent);
    const {user} = useUser();
    const [isGenerating, setIsGenerating] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<z.input<typeof resumeSchema>>({
        resolver: zodResolver(resumeSchema),
        defaultValues: {
            contactInfo: {},
            experience: [],
            education: [],
            projects: [],
            certifications: [],
            skills: "",
            summary: "",
        },
    })

    const {
        loading: isSaving,
        fn: saveResumeFn,
        data: saveResult,
        error: saveError,
    } = useFetch(saveResume);

    const formValues = watch();

    useEffect(() => {
        if (initialContent) setActiveTab("preview");
    }, [initialContent]);

    useEffect(() =>{
        if(activeTab === "edit"){
            const newContent = getCombinedContent();
            setPreviewContent(newContent ? newContent : initialContent);
        }
    }, [formValues, activeTab]);

    const getContactMarkdown = () => {
        const { contactInfo } = formValues;
        const parts = [];
        if(contactInfo.email){
            parts.push(`Email: ${contactInfo.email}`);
        }
        if(contactInfo.mobile){
            parts.push(`Mobile: ${contactInfo.mobile}`);
        }
        if(contactInfo.linkedin){
            parts.push(`LinkedIn: ${contactInfo.linkedin}`);
        }
        if(contactInfo.github){
            parts.push(`GitHub: ${contactInfo.github}`);
        }
        return parts.length > 0 ? 
        `## <div align="center"> ${user.fullName}</div>
        \n\n<div align="center"> ${parts.join("\n")}</div>`: "";
    }

    const getCombinedContent = () => {
        const { summary,skills, experience,education, projects} = formValues;

        return [
            getContactMarkdown(),
            summary && `## Proffessional Summary\n\n${summary}`,
            skills && `## Skills\n\n${skills}`,
            experience && `## Experience\n\n${experience}`,
            education && `## Education\n\n${education}`,
            projects && `## Projects\n\n${projects}`,
        ]
        .filter(Boolean)
        .join("\n\n");
    }

    useEffect(()=>{
        if(saveResult  && !isSaving){
            toast.success("Resume saved successfully");
        }
        if(saveError){
            toast.error("Failed to save resume");
        }
    }, [saveResult, saveError, isSaving]);
    const onSubmit = async (data: z.input<typeof resumeSchema>) => {
        try{
            await saveResumeFn(previewContent);
            
        }catch(error){
            console.error("Error saving resume:", error);
        }
    }

    const generatePDF = async () => {
        setIsGenerating(true);
        try{
            const element = document.getElementById("resume-pdf");
            if(!element) return;

            const opt = {
                margin: [15, 15],
                filename: "resume.pdf",
                image: {type: "jpeg", quality: 0.98},
                html2canvas: {scale: 2},
                jsPDF: {unit: "mm", format: "a4", orientation: "portrait"}
            }

            await html2pdf().set(opt).from(element).save();
            
        }catch(error){
            console.error("Error generating PDF:", error);
        }finally{
            setIsGenerating(false);
        }
        
    }

    return (
        <div className="max-w-5xl mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="font-bold gradient-title text-5xl md:text-6xl">
                        Resume Builder
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Craft a professional resume that stands out
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 shadow-sm hover:shadow transition-shadow"
                    onClick={onSubmit}
                    disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                            </>
                        ) : (
                            <>
                            <Save className="h-4 w-4" />
                            Save
                            </>
                        )}
                    </Button>
                    <Button className="gap-2 shadow-sm hover:shadow-md transition-shadow"
                    onClick={generatePDF}
                    disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating PDF...
                            </>
                        ) : (
                            <>
                            <Download className="h-4 w-4" />
                            Download PDF
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full max-w-xs grid-cols-2">
                    <TabsTrigger value="edit">Form</TabsTrigger>
                    <TabsTrigger value="preview">Markdown</TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="space-y-0">
                    <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>

                        {/* ── Contact Information ── */}
                        <section className="space-y-4">
                            <div className="border-b border-border/50 pb-2">
                                <h3 className="text-lg font-semibold tracking-tight">
                                    Contact Information
                                </h3>
                                <p className="text-muted-foreground text-xs mt-0.5">
                                    How recruiters and employers can reach you
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                                    <Input
                                        {...register("contactInfo.email")}
                                        type="email"
                                        placeholder="your@email.com"
                                        className="transition-shadow focus-visible:shadow-md"
                                    />
                                    {errors.contactInfo?.email && (
                                        <p className="text-destructive text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                            {errors.contactInfo.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium text-muted-foreground">Mobile Number</Label>
                                    <Input
                                        {...register("contactInfo.mobile")}
                                        type="tel"
                                        placeholder="+91 1234567890"
                                        className="transition-shadow focus-visible:shadow-md"
                                    />
                                    {errors.contactInfo?.mobile && (
                                        <p className="text-destructive text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                            {errors.contactInfo.mobile?.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium text-muted-foreground">LinkedIn URL</Label>
                                    <Input
                                        {...register("contactInfo.linkedin")}
                                        type="url"
                                        placeholder="https://linkedin.com/in/yourprofile"
                                        className="transition-shadow focus-visible:shadow-md"
                                    />
                                    {errors.contactInfo?.linkedin && (
                                        <p className="text-destructive text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                            {errors.contactInfo.linkedin.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium text-muted-foreground">GitHub</Label>
                                    <Input
                                        {...register("contactInfo.github")}
                                        type="url"
                                        placeholder="https://github.com/yourprofile"
                                        className="transition-shadow focus-visible:shadow-md"
                                    />
                                    {errors.contactInfo?.github && (
                                        <p className="text-destructive text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                            {errors.contactInfo.github.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* ── Summary ── */}
                        <section className="space-y-4">
                            <div className="border-b border-border/50 pb-2">
                                <h3 className="text-lg font-semibold tracking-tight">
                                    Professional Summary
                                </h3>
                                <p className="text-muted-foreground text-xs mt-0.5">
                                    A concise overview of your professional background
                                </p>
                            </div>
                            <Controller
                                name="summary"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        placeholder="Write a summary of your skills and experience..."
                                        rows={4}
                                        className="min-h-[120px] resize-y transition-shadow focus-visible:shadow-md"
                                    />
                                )}
                            />
                            {errors.summary && (
                                <p className="text-destructive text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {errors.summary.message}
                                </p>
                            )}
                        </section>

                        {/* ── Skills ── */}
                        <section className="space-y-4">
                            <div className="border-b border-border/50 pb-2">
                                <h3 className="text-lg font-semibold tracking-tight">
                                    Skills
                                </h3>
                                <p className="text-muted-foreground text-xs mt-0.5">
                                    List your key technical and soft skills
                                </p>
                            </div>
                            <Controller
                                name="skills"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        placeholder="e.g. React, TypeScript, Node.js, Leadership..."
                                        rows={4}
                                        className="min-h-[120px] resize-y transition-shadow focus-visible:shadow-md"
                                    />
                                )}
                            />
                            {errors.skills && (
                                <p className="text-destructive text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {errors.skills.message}
                                </p>
                            )}
                        </section>

                        {/* ── Work Experience ── */}
                        <section className="space-y-4">
                            <div className="border-b border-border/50 pb-2">
                                <h3 className="text-lg font-semibold tracking-tight">
                                    Work Experience
                                </h3>
                                <p className="text-muted-foreground text-xs mt-0.5">
                                    Your professional roles and accomplishments
                                </p>
                            </div>
                            <Controller
                                name="experience" 
                                control={control}
                                render={({ field }) => (
                                    <EntryForm
                                        type="Experience"  
                                        entries={field.value || []}
                                        onChange={field.onChange}
                                    />  
                                )}
                            />
                            {errors.experience && (
                                <p className="text-destructive text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {errors.experience.message}
                                </p>
                            )}
                        </section>

                        {/* ── Education ── */}
                        <section className="space-y-4">
                            <div className="border-b border-border/50 pb-2">
                                <h3 className="text-lg font-semibold tracking-tight">
                                    Education
                                </h3>
                                <p className="text-muted-foreground text-xs mt-0.5">
                                    Your academic qualifications
                                </p>
                            </div>
                            <Controller
                                name="education" 
                                control={control}
                                render={({ field }) => (
                                    <EntryForm
                                        type="Education"  
                                        entries={field.value || []}
                                        onChange={field.onChange}
                                    />  
                                )}
                            />
                            {errors.education && (
                                <p className="text-destructive text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {errors.education.message}
                                </p>
                            )}
                        </section>

                        {/* ── Projects ── */}
                        <section className="space-y-4">
                            <div className="border-b border-border/50 pb-2">
                                <h3 className="text-lg font-semibold tracking-tight">
                                    Projects
                                </h3>
                                <p className="text-muted-foreground text-xs mt-0.5">
                                    Notable projects you&apos;ve built or contributed to
                                </p>
                            </div>
                            <Controller
                                name="projects" 
                                control={control}
                                render={({ field }) => (
                                    <EntryForm
                                        type="Project"  
                                        entries={field.value || []}
                                        onChange={field.onChange}
                                    />  
                                )}
                            />
                            {errors.projects && (
                                <p className="text-destructive text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {errors.projects.message}
                                </p>
                            )}
                        </section>

                    </form>
                </TabsContent>

                <TabsContent value="preview">
                    <Button variant="link" type="button" className="mb-2"
                    onClick={() => setResumeMode(resumeMode === "preview" ? "edit" : "preview")}
                    >
                        {resumeMode === "preview" ? (
                            <>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Resume
                            </>

                        ) : (
                            <>
                            <Monitor className="h-4 w-4 mr-2" />
                            Preview Resume
                            </>
                        )}
                    </Button>

                    {resumeMode != "preview" && (
                        <div className="flex p -3 gap-2 items-center border-2 ">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            <span className="text-muted-foreground text-xs mt-0.5">
                                You will lose edited markdown if you switch to preview mode.
                            </span>
                        </div>
                    )}

                    <div className="border-t border-border/50 pt-2">
                        <MDEditor
                            value={previewContent}
                            onChange={setPreviewContent}
                            height={800}
                            preview={resumeMode}
                            />
                    </div>

                    <div className="hidden" >
                    <div id="resume-pdf">
                        <MDEditor.Markdown
                            source={previewContent}
                            style={{
                                background: "white",
                                color: "black",
                            }}
                            />
                    </div>

                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ResumeBuilder;