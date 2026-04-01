import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Trash2, Calendar, Building2 } from "lucide-react";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";

export default async function AICoverLetterPage() {
    const { userId } = await auth();
    if (!userId) return null;

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return null;

    const coverLetters = await db.coverLetter.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="container mx-auto py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                        My Cover Letters
                    </h1>
                    <p className="text-muted-foreground">Manage and track your AI-generated cover letters tailored to specific jobs</p>
                </div>
                <Link href="/ai-cover-letter/new">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-105">
                        <Plus className="w-5 h-5 mr-2" />
                        Create New Letter
                    </Button>
                </Link>
            </div>

            {coverLetters.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-border/60 rounded-2xl bg-background/40 backdrop-blur-xl shadow-sm">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10">
                        <FileText className="w-10 h-10 text-purple-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 tracking-tight">No Cover Letters Yet</h2>
                    <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">Let AI write a highly personalized, compelling cover letter that highlights your unique skills and dramatically boosts your chances of landing interviews.</p>
                    <Link href="/ai-cover-letter/new">
                        <Button variant="outline" className="h-12 px-6 border-purple-500/30 text-purple-500 hover:bg-purple-500/10 hover:border-purple-500/50 font-semibold transition-all shadow-sm">
                            Generate Your First Letter
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {coverLetters.map((letter) => (
                        <Card key={letter.id} className="group hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 border-border/50 bg-background/60 backdrop-blur-2xl flex flex-col h-full overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <CardHeader className="pb-3 flex-1 relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1.5 pr-2">
                                        <CardTitle className="text-lg line-clamp-1 group-hover:text-purple-400 transition-colors">
                                            {letter.jobTitle}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-1.5 font-medium text-foreground/80">
                                            <Building2 className="w-4 h-4 text-purple-500/70" />
                                            {letter.companyName}
                                        </CardDescription>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 text-purple-500 shrink-0 group-hover:scale-110 group-hover:shadow-md transition-all">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-4 relative z-10">
                                <div className="flex items-center text-xs font-medium text-muted-foreground">
                                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                    Updated {format(new Date(letter.updatedAt), "MMM dd, yyyy")}
                                </div>
                                <div className="flex items-center gap-3 pt-3 border-t border-border/50 mt-auto">
                                    <Link href={`/ai-cover-letter/${letter.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full bg-background/50 hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500/40 transition-all shadow-sm">
                                            View & Edit
                                        </Button>
                                    </Link>
                                    <form action={async () => {
                                        "use server";
                                        await db.coverLetter.delete({ where: { id: letter.id } });
                                        revalidatePath("/ai-cover-letter");
                                    }}>
                                        <Button variant="outline" size="icon" className="text-destructive/80 hover:text-destructive hover:bg-destructive/10 border-border/50 transition-colors group/del">
                                            <Trash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" />
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}