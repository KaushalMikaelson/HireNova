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
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { entriesToMarkdown } from "@/app/lib/helper";


const ResumeBuilder = ({ initialContent }: { initialContent: string }) => {

    const [activeTab, setActiveTab] = useState("edit");
    const [resumeMode, setResumeMode] = useState<"preview" | "edit">("preview");
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
        if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
        if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
        if (contactInfo.linkedin) parts.push(`🔗 [LinkedIn](${contactInfo.linkedin})`);
        if (contactInfo.github) parts.push(`💻 [GitHub](${contactInfo.github})`);

        return parts.length > 0 
            ? `# <div align="center">${user?.fullName || ""}</div>\n\n<div align="center">\n\n${parts.join(' &nbsp;|&nbsp; ')}\n\n</div>\n\n---`
            : `# <div align="center">${user?.fullName || ""}</div>\n\n---`;
    }

    const getCombinedContent = () => {
        const { summary, skills, experience, education, projects } = formValues;

        return [
            getContactMarkdown(),
            summary && `## Professional Summary\n\n${summary}`,
            skills && `## Skills\n\n${skills}`,
            entriesToMarkdown(experience, "Work Experience"),
            entriesToMarkdown(education, "Education"),
            entriesToMarkdown(projects, "Projects"),
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
        try {
            const element = document.getElementById("resume-pdf");
            if (!element) {
                toast.error("Could not find resume content.");
                return;
            }

            const printWindow = window.open("", "_blank", "width=900,height=700");
            if (!printWindow) {
                toast.error("Popup blocked. Please allow popups for this site.");
                return;
            }

            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8" />
                    <title>Resume - ${user?.fullName || "Resume"}</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body {
                            font-family: 'Inter', 'Arial', sans-serif;
                            font-size: 13px;
                            line-height: 1.65;
                            color: #1f2937;
                            background: #fff;
                            padding: 36px 48px;
                            max-width: 860px;
                            margin: 0 auto;
                        }
                        h1 {
                            font-size: 30px;
                            font-weight: 700;
                            color: #111827;
                            letter-spacing: -0.5px;
                            margin-bottom: 6px;
                        }
                        h2 {
                            font-size: 11px;
                            font-weight: 700;
                            color: #4f46e5;
                            text-transform: uppercase;
                            letter-spacing: 1.2px;
                            margin-top: 22px;
                            margin-bottom: 8px;
                            padding-bottom: 5px;
                            border-bottom: 2px solid #e5e7eb;
                        }
                        h3 {
                            font-size: 14px;
                            font-weight: 600;
                            color: #111827;
                            margin-top: 12px;
                            margin-bottom: 1px;
                        }
                        p { margin-bottom: 5px; color: #374151; }
                        ul { padding-left: 18px; margin: 4px 0 8px; }
                        li { margin-bottom: 3px; color: #374151; }
                        a { color: #4f46e5; text-decoration: none; }
                        strong { font-weight: 600; color: #111; }
                        em { font-style: italic; color: #6b7280; font-size: 12px; }
                        hr {
                            border: none;
                            border-top: 2px solid #e5e7eb;
                            margin: 10px 0 16px;
                        }
                        div[align="center"] { text-align: center; }
                        div[align="center"] p,
                        div[align="center"] > * {
                            font-size: 12px;
                            color: #6b7280;
                        }
                        .section-entry {
                            margin-bottom: 12px;
                            padding-bottom: 10px;
                            border-bottom: 1px solid #f3f4f6;
                        }
                        .section-entry:last-child { border-bottom: none; }
                        @media print {
                            body { padding: 0; }
                            @page { margin: 12mm 18mm; size: A4 portrait; }
                            h2 { page-break-after: avoid; }
                        }
                    </style>
                </head>
                <body>
                    ${element.innerHTML}
                </body>
                </html>
            `);

            printWindow.document.close();

            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.focus();
                    printWindow.print();
                    printWindow.close();
                    toast.success("PDF generated! Save it from the print dialog.");
                }, 300);
            };

        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error("Failed to generate PDF.");
        } finally {
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
                    onClick={handleSubmit(onSubmit)}
                    disabled={!!isSaving}
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
                    <div className="flex items-center justify-between mb-4">
                        <Button variant="outline" size="sm" className="gap-2"
                            onClick={() => setResumeMode(resumeMode === "preview" ? "edit" : "preview")}
                        >
                            {resumeMode === "preview" ? (
                                <><Edit className="h-4 w-4" /> Edit Markdown</>
                            ) : (
                                <><Monitor className="h-4 w-4" /> Preview Resume</>
                            )}
                        </Button>

                        {resumeMode !== "preview" && (
                            <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-lg px-3 py-1.5 text-xs font-medium">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                Changes in markdown won&apos;t sync back to the form
                            </div>
                        )}
                    </div>

                    {resumeMode === "edit" ? (
                        <div className="rounded-xl overflow-hidden border border-border/50">
                            <MDEditor
                                value={previewContent}
                                onChange={(val) => setPreviewContent(val || "")}
                                height={750}
                                preview="edit"
                                hideToolbar={false}
                            />
                        </div>
                    ) : (
                        /* A4-style preview card */
                        <div className="flex justify-center">
                            <div className="w-full max-w-[860px] bg-white text-gray-900 shadow-2xl rounded-xl overflow-hidden" style={{ minHeight: "1100px" }}>
                                {/* Resume header strip */}
                                <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                                <div className="p-10">
                                    <MDEditor.Markdown
                                        source={previewContent}
                                        style={{ background: "transparent", color: "#111827" }}
                                        className="prose prose-sm max-w-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hidden off-screen element for PDF generation */}
                    <div className="absolute left-[-9999px] top-0 w-[860px]">
                        <div id="resume-pdf" className="p-10 bg-white text-gray-900">
                            <MDEditor.Markdown
                                source={previewContent}
                                style={{ background: "white", color: "#111827" }}
                            />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ResumeBuilder;