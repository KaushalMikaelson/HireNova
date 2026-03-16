"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entrySchema } from "@/app/lib/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, Loader2, PlusCircle, Sparkles, Trash2, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { improveWithAI } from "@/actions/resume";
import { format, parse } from "date-fns";


const formatDisplayDate = (dateString) => {
    if(!dateString) return "";
    const date = parse(dateString, "yyyy-MM", new Date());
    return format(date, "yyyy-MM");
}

const EntryForm = ({ type, entries, onChange }: { type: string; entries: any[]; onChange: (entries: any[]) => void }) => {

    const [isAdding, setIsAdding] = useState(false);

    const {
        register, 
        handleSubmit: handleValidation,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<z.input<typeof entrySchema>>({
        resolver: zodResolver(entrySchema),
        defaultValues: {
            title: "",
            organization: "",
            startDate: "",
            endDate: "",
            description: "",
            current: false,
        },
    })


    const current = watch("current");

    const {
        loading: isImproving,
        fn: improveWithAIFn,
        data: improvedContent,
        error: improveError,
    } =  useFetch(improveWithAI);


    const handleDelete = (index) => {
        const newEntries = entries.filter((_, i) => i !== index);
        onChange(newEntries);
    }

    const handleAdd = handleValidation((data) => {
        const formattedEntry = {
            ...data,
            startDate: formatDisplayDate(data.startDate),
            endDate: formatDisplayDate(data.endDate),
        }

        onChange([...entries, formattedEntry]);
        reset();
        setIsAdding(false);
        
    }) 

    useEffect(() => {
        if(improvedContent  && !isImproving){
            setValue("description", improvedContent);
            toast.success("Description improved with AI");
        }
        if(improveError){
            toast.error("Failed to improve description");
        }
    }, [improvedContent, improveError, isImproving]);

    const handleImproveDescription = async () => {
        const description = watch("description");
        if(!description) {
            toast.error("Please enter a description");
            return;
        };

        await improveWithAIFn({
            current: description, 
            type: type.toLowerCase(),});
    }
        return (
        <div className="space-y-4">
            <div className="space-y-3">
                {entries.map((item, index) => {
                    return(
                        <Card
                            key={index}
                            className="group border border-border/50 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-sm font-semibold tracking-tight truncate">
                                        {item.title}
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                                        <Briefcase className="h-3 w-3 shrink-0" />
                                        <span className="truncate">{item.organization}</span>
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                                    onClick={() => {
                                        handleDelete(index);
                                    }}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-2">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 shrink-0" />
                                    <span className="font-medium">
                                        {item.current
                                            ? `${item.startDate} — Present`
                                            : `${item.startDate} — ${item.endDate}`}
                                    </span>
                                    {item.current && (
                                        <span className="ml-1 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                            Current
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2">
                                    {item.description}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
            {isAdding && (
                <Card className="border border-border/60 shadow-md bg-card/80 backdrop-blur-sm transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-semibold tracking-tight">
                            Add {type}
                        </CardTitle>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            onClick={() => {
                                setIsAdding(false);
                                reset();
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-2">
                        {/* Title & Organization */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Title / Position
                                </Label>
                                <Input
                                    placeholder="e.g. Software Engineer"
                                    className="transition-shadow focus-visible:shadow-md"
                                    {...register("title")}
                                />
                                {errors.title && (
                                    <p className="text-destructive text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Organization / Company
                                </Label>
                                <Input
                                    placeholder="e.g. Google"
                                    className="transition-shadow focus-visible:shadow-md"
                                    {...register("organization")}
                                />
                                {errors.organization && (
                                    <p className="text-destructive text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                        {errors.organization.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Start Date
                                </Label>
                                <Input
                                    type="month"
                                    className="transition-shadow focus-visible:shadow-md"
                                    {...register("startDate")}
                                />
                                {errors.startDate && (
                                    <p className="text-destructive text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                        {errors.startDate.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    End Date
                                </Label>
                                <Input
                                    type="month"
                                    className={`transition-shadow focus-visible:shadow-md ${current ? "opacity-50 cursor-not-allowed" : ""}`}
                                    {...register("endDate")}
                                    disabled={current}
                                />
                                {errors.endDate && (
                                    <p className="text-destructive text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                        {errors.endDate.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Current Checkbox */}
                        <div className="flex items-center gap-2 select-none">
                            <input
                                type="checkbox"
                                id="current"
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30 transition-colors cursor-pointer accent-primary"
                                {...register("current")}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setValue("current", checked);
                                    if (checked) {
                                        setValue("endDate", "");
                                    }
                                }}
                            />
                            <Label
                                htmlFor="current"
                                className="text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Currently working here
                            </Label>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-muted-foreground">
                                Description
                            </Label>
                            <Textarea   
                                placeholder={`Describe your ${type.toLowerCase()} — responsibilities, achievements, impact...`}
                                className="min-h-[120px] resize-y transition-shadow focus-visible:shadow-md"
                                {...register("description")}
                            />
                            {errors.description && (
                                <p className="text-destructive text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* Improve with AI button */}
                        <div className="flex items-center justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="gap-2 text-primary border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-200"
                                onClick={handleImproveDescription}
                                disabled={isImproving || !watch("description")}
                            >
                                {isImproving ? (
                                    <>
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        <span>Improving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-3.5 w-3.5" />
                                        <span>Improve with AI</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t border-border/40 pt-4">
                        <Button    
                            type="button"
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => {
                                reset();
                                setIsAdding(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleAdd}
                            className="gap-2 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Add Entry
                        </Button>
                    </CardFooter>
                </Card>
            )}
            {!isAdding && (
                <Button 
                    type="button"
                    className="w-full border-dashed border-2 border-border/60 bg-transparent text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 h-12"
                    variant="outline"
                    onClick={() => setIsAdding(true)}
                > 
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add {type}
                </Button>
            )}
        </div>
    );
};

export default EntryForm;
