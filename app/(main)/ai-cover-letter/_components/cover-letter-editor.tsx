"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { generateCoverLetter, updateCoverLetter } from "@/actions/cover-letter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, Wand2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function CoverLetterEditor({ initialData }: { initialData: any }) {
    const router = useRouter()
    
    // Generator Mode states
    const [companyName, setCompanyName] = useState(initialData?.companyName || "")
    const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || "")
    const [jobDescription, setJobDescription] = useState(initialData?.jobDescription || "")

    // Editor Mode states
    const [content, setContent] = useState(initialData?.content || "")
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const isNew = !initialData

    const handleGenerate = async () => {
        if (!companyName || !jobTitle || !jobDescription) {
            toast.error("Please fill in all details before generating.")
            return
        }

        setIsGenerating(true)
        try {
            const res = await generateCoverLetter({ companyName, jobTitle, jobDescription })
            if (res.success) {
                toast.success("Cover letter generated perfectly!")
                router.push(`/ai-cover-letter/${res.id}`)
            } else {
                toast.error(res.error || "Failed to generate cover letter.")
            }
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSave = async () => {
        if (isNew) return
        setIsSaving(true)
        try {
            await updateCoverLetter(initialData.id, content)
            toast.success("Cover letter saved successfully!")
            router.refresh()
        } catch (error) {
            toast.error("Failed to save cover letter.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link href="/ai-cover-letter" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-purple-500 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cover Letters
            </Link>

            <Card className="border-border/50 bg-background/60 backdrop-blur-2xl shadow-xl shadow-purple-500/5">
                <CardHeader>
                    <CardTitle className="text-2xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        {isNew ? "Write a New Cover Letter" : `${jobTitle} at ${companyName}`}
                    </CardTitle>
                    <CardDescription>
                        {isNew 
                            ? "Fill out the role details below and let AI craft a highly personalized cover letter."
                            : "Easily view and edit your generated cover letter below."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Inputs are disabled if we're not inside the Generator Mode */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Company Name <span className="text-destructive">*</span></Label>
                            <Input 
                                placeholder="E.g. Google, Microsoft, Startup Inc." 
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                disabled={!isNew || isGenerating}
                                className="bg-background/50 border-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Job Title <span className="text-destructive">*</span></Label>
                            <Input 
                                placeholder="E.g. Senior Frontend Engineer" 
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                disabled={!isNew || isGenerating}
                                className="bg-background/50 border-primary/20"
                            />
                        </div>
                    </div>
                    
                    {isNew && (
                        <div className="space-y-2">
                            <Label>Job Description <span className="text-destructive">*</span></Label>
                            <Textarea 
                                placeholder="Paste the full job description here..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                disabled={isGenerating}
                                className="h-40 bg-background/50 border-primary/20"
                            />
                        </div>
                    )}

                    {!isNew && (
                        <div className="space-y-2 pt-4">
                            <Label className="text-purple-500/80 uppercase text-xs tracking-wider font-bold">Generated Letter Content</Label>
                            <Textarea 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[500px] leading-relaxed resize-y bg-background/50 border-primary/20"
                            />
                        </div>
                    )}

                    <div className="flex justify-end pt-4 gap-3">
                        {isNew ? (
                            <Button 
                                onClick={handleGenerate} 
                                disabled={isGenerating}
                                className="bg-purple-600 hover:bg-purple-700 text-white min-w-[200px]"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-5 h-5 mr-2" />
                                        Generate with AI
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button 
                                onClick={handleSave} 
                                disabled={isSaving || content === initialData.content}
                                className="bg-purple-600 hover:bg-purple-700 text-white min-w-[150px]"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
