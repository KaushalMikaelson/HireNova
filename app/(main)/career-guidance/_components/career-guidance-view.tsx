"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BrainCircuit, Send, Loader2, Sparkles, Target, TrendingUp,
    ChevronRight, BarChart3, BookOpen, Zap, AlertCircle, CheckCircle2,
    Clock, Star, MessageSquare, Map, Activity, RefreshCw
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
    generateCareerAdvice,
    generateCareerRoadmap,
    generateSkillGapAnalysis,
} from "@/actions/career-guidance";
import { toast } from "sonner";

// ── Animation variants ──────────────────────────────────────────────────────
const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 14 } },
};

// ── Types ───────────────────────────────────────────────────────────────────
interface RoadmapQuarter {
    quarter: string;
    title: string;
    goals: string[];
    skills: string[];
    milestone: string;
}

interface SkillStrength {
    skill: string;
    level: number;
    note: string;
}

interface SkillGap {
    skill: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    timeToLearn: string;
    resources: string[];
}

interface SkillGapResult {
    strengths: SkillStrength[];
    gaps: SkillGap[];
    overallScore: number;
    summary: string;
}

// ── Suggested quick questions ────────────────────────────────────────────────
const QUICK_QUESTIONS = [
    "How can I negotiate a higher salary in my next role?",
    "What skills should I focus on to advance my career?",
    "How do I transition into a senior leadership position?",
    "What are the best ways to build my professional network?",
    "How can I stand out in a competitive job market?",
];

const PRIORITY_CONFIG = {
    HIGH: { color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/30", label: "High Priority" },
    MEDIUM: { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", label: "Medium Priority" },
    LOW: { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", label: "Low Priority" },
};

// ── Main Component ───────────────────────────────────────────────────────────
export default function CareerGuidanceView({ user }: { user: any }) {
    // Tab state
    const [activeTab, setActiveTab] = useState<"chat" | "roadmap" | "skills">("chat");

    // Chat state
    const [question, setQuestion] = useState("");
    const [chatHistory, setChatHistory] = useState<{ q: string; a: string }[]>([]);
    const [chatLoading, setChatLoading] = useState(false);

    // Roadmap state
    const [roadmap, setRoadmap] = useState<RoadmapQuarter[] | null>(null);
    const [roadmapLoading, setRoadmapLoading] = useState(false);

    // Skill gap state
    const [skillGap, setSkillGap] = useState<SkillGapResult | null>(null);
    const [skillGapLoading, setSkillGapLoading] = useState(false);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleAskQuestion = async (q?: string) => {
        const finalQuestion = q ?? question;
        if (!finalQuestion.trim()) return;
        setChatLoading(true);
        setQuestion("");
        try {
            const answer = await generateCareerAdvice(finalQuestion);
            setChatHistory((prev) => [...prev, { q: finalQuestion, a: answer }]);
        } catch {
            toast.error("Failed to get career advice. Please try again.");
        } finally {
            setChatLoading(false);
        }
    };

    const handleGenerateRoadmap = async () => {
        setRoadmapLoading(true);
        try {
            const data = await generateCareerRoadmap();
            setRoadmap(data);
        } catch {
            toast.error("Failed to generate roadmap. Please try again.");
        } finally {
            setRoadmapLoading(false);
        }
    };

    const handleSkillGap = async () => {
        setSkillGapLoading(true);
        try {
            const data = await generateSkillGapAnalysis();
            setSkillGap(data);
        } catch {
            toast.error("Failed to analyse skills. Please try again.");
        } finally {
            setSkillGapLoading(false);
        }
    };

    const tabs = [
        { id: "chat" as const, label: "AI Advisor", icon: MessageSquare },
        { id: "roadmap" as const, label: "Career Roadmap", icon: Map },
        { id: "skills" as const, label: "Skill Gap", icon: BarChart3 },
    ];

    return (
        <motion.div className="space-y-8 pb-12" variants={containerVariants} initial="hidden" animate="show">
            {/* ── Page Header ─────────────────────────────────────────────── */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2.5 rounded-xl bg-primary/10">
                            <BrainCircuit className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            AI Career Guidance
                        </h1>
                    </div>
                    <p className="text-muted-foreground mt-1 ml-1">
                        Personalised advice for{" "}
                        <span className="text-foreground font-medium capitalize">
                            {user.industry?.replace(/-/g, " ") ?? "your"} industry
                        </span>
                    </p>
                </div>

                {/* Profile summary badges */}
                <div className="flex flex-wrap gap-2">
                    {user.industry && (
                        <Badge variant="outline" className="bg-background/50 backdrop-blur-sm border-primary/20 text-primary">
                            <Sparkles className="w-3 h-3 mr-1.5" />
                            {user.industry.replace(/-/g, " ")}
                        </Badge>
                    )}
                    {user.experience && (
                        <Badge variant="outline" className="bg-background/50 backdrop-blur-sm border-border/40">
                            <Activity className="w-3 h-3 mr-1.5" />
                            {user.experience} yrs exp
                        </Badge>
                    )}
                    {user.industryInsight?.demandLevel && (
                        <Badge
                            variant="outline"
                            className={`bg-background/50 backdrop-blur-sm border-border/40 ${user.industryInsight.demandLevel === "HIGH"
                                ? "text-emerald-400"
                                : user.industryInsight.demandLevel === "MEDIUM"
                                    ? "text-amber-400"
                                    : "text-rose-400"
                                }`}
                        >
                            <TrendingUp className="w-3 h-3 mr-1.5" />
                            {user.industryInsight.demandLevel} Demand
                        </Badge>
                    )}
                </div>
            </motion.div>

            {/* ── Quick Stats ─────────────────────────────────────────────── */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    {
                        label: "Market Outlook",
                        value: user.industryInsight?.marketOutlook ?? "N/A",
                        icon: TrendingUp,
                        color: "text-emerald-400",
                        bg: "bg-emerald-500/10",
                    },
                    {
                        label: "Growth Rate",
                        value: user.industryInsight?.growthRate != null
                            ? `${user.industryInsight.growthRate.toFixed(1)}%`
                            : "N/A",
                        icon: BarChart3,
                        color: "text-blue-400",
                        bg: "bg-blue-500/10",
                    },
                    {
                        label: "Skills Tracked",
                        value: user.skills?.length ? `${user.skills.length} skills` : "None yet",
                        icon: Star,
                        color: "text-pink-400",
                        bg: "bg-pink-500/10",
                    },
                ].map((stat) => (
                    <motion.div key={stat.label} variants={itemVariants}>
                        <Card className="relative overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50 bg-background/60 backdrop-blur-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <CardContent className="p-5 flex items-center gap-4 relative z-10">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                                    <p className="text-xl font-extrabold tracking-tight capitalize">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* ── Tab Navigation ───────────────────────────────────────────── */}
            <motion.div variants={itemVariants} className="flex gap-1 p-1 bg-muted/50 rounded-xl border border-border/40 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === tab.id
                            ? "bg-background shadow-md text-foreground border border-border/50"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </motion.div>

            {/* ── Tab Content ─────────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                {/* ── AI Chat Advisor ───────────────────────────────────── */}
                {activeTab === "chat" && (
                    <motion.div
                        key="chat"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-6"
                    >
                        {/* Quick questions */}
                        <Card className="border-border/50 bg-background/60 backdrop-blur-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Zap className="h-4 w-4 text-primary" />
                                    Quick Questions
                                </CardTitle>
                                <CardDescription>Tap a prompt to get instant guidance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_QUESTIONS.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => handleAskQuestion(q)}
                                            disabled={chatLoading}
                                            className="text-sm px-4 py-2 rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all duration-200 text-left disabled:opacity-50"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Chat history */}
                        {chatHistory.length > 0 && (
                            <div className="space-y-4">
                                {chatHistory.map((entry, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-3"
                                    >
                                        {/* User question */}
                                        <div className="flex justify-end">
                                            <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm bg-primary text-primary-foreground text-sm font-medium shadow-lg">
                                                {entry.q}
                                            </div>
                                        </div>
                                        {/* AI answer */}
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <BrainCircuit className="h-4 w-4 text-primary" />
                                            </div>
                                            <Card className="flex-1 border-border/50 bg-background/70 backdrop-blur-xl shadow-sm">
                                                <CardContent className="p-4 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                                    {entry.a}
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Loading state */}
                        {chatLoading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <BrainCircuit className="h-4 w-4 text-primary animate-pulse" />
                                </div>
                                <Card className="flex-1 border-border/50 bg-background/70 backdrop-blur-xl">
                                    <CardContent className="p-4 flex items-center gap-3 text-muted-foreground text-sm">
                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        Analysing your profile and crafting personalised advice…
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Input box */}
                        <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-lg">
                            <CardContent className="p-4 space-y-3">
                                <Textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAskQuestion();
                                        }
                                    }}
                                    placeholder="Ask anything about your career — salary negotiation, skill gaps, career transitions…"
                                    className="min-h-[100px] bg-transparent border-border/40 resize-none focus-visible:ring-primary/30 text-sm"
                                    disabled={chatLoading}
                                />
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-muted-foreground">Press Enter to send · Shift+Enter for new line</p>
                                    <Button
                                        onClick={() => handleAskQuestion()}
                                        disabled={chatLoading || !question.trim()}
                                        className="gap-2 px-5"
                                    >
                                        {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        Ask AI
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* ── Career Roadmap ────────────────────────────────────── */}
                {activeTab === "roadmap" && (
                    <motion.div
                        key="roadmap"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-6"
                    >
                        {!roadmap ? (
                            <Card className="border-border/50 bg-background/60 backdrop-blur-xl">
                                <CardContent className="p-12 flex flex-col items-center justify-center text-center gap-5">
                                    <div className="p-5 rounded-2xl bg-primary/10">
                                        <Map className="h-10 w-10 text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold">Generate Your 12-Month Roadmap</h3>
                                        <p className="text-muted-foreground max-w-md">
                                            Get a personalised quarterly action plan tailored to your experience, skills, and industry trends.
                                        </p>
                                    </div>
                                    <Button onClick={handleGenerateRoadmap} disabled={roadmapLoading} size="lg" className="gap-2 px-8">
                                        {roadmapLoading
                                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
                                            : <><Sparkles className="h-4 w-4" /> Generate Roadmap</>}
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-foreground">Your 12-Month Career Roadmap</h2>
                                    <Button variant="outline" size="sm" onClick={handleGenerateRoadmap} disabled={roadmapLoading} className="gap-2 border-border/50">
                                        {roadmapLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                                        Regenerate
                                    </Button>
                                </div>

                                {/* Roadmap timeline */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {roadmap.map((quarter, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <Card className="h-full border-border/50 bg-background/60 backdrop-blur-xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center justify-between">
                                                        <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary font-semibold">
                                                            {quarter.quarter}
                                                        </Badge>
                                                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                            {i + 1}
                                                        </div>
                                                    </div>
                                                    <CardTitle className="text-base mt-2">{quarter.title}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    {/* Goals */}
                                                    <div>
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Goals</p>
                                                        <ul className="space-y-2">
                                                            {quarter.goals.map((goal, gi) => (
                                                                <li key={gi} className="flex items-start gap-2 text-sm text-foreground/80">
                                                                    <ChevronRight className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
                                                                    {goal}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Skills */}
                                                    <div>
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Skills to Build</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {quarter.skills.map((skill) => (
                                                                <Badge key={skill} variant="secondary" className="text-xs bg-secondary/50">
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Milestone */}
                                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                                                        <Target className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                                        <p className="text-sm text-foreground/80 font-medium">{quarter.milestone}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ── Skill Gap Analysis ────────────────────────────────── */}
                {activeTab === "skills" && (
                    <motion.div
                        key="skills"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-6"
                    >
                        {!skillGap ? (
                            <Card className="border-border/50 bg-background/60 backdrop-blur-xl">
                                <CardContent className="p-12 flex flex-col items-center justify-center text-center gap-5">
                                    <div className="p-5 rounded-2xl bg-primary/10">
                                        <BarChart3 className="h-10 w-10 text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold">Analyse Your Skill Gaps</h3>
                                        <p className="text-muted-foreground max-w-md">
                                            See how your current skills stack up against industry demands and get a prioritised list of skills to learn.
                                        </p>
                                    </div>
                                    {user.skills?.length === 0 && (
                                        <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl">
                                            <AlertCircle className="h-4 w-4 shrink-0" />
                                            Add skills to your profile for a more accurate analysis.
                                        </div>
                                    )}
                                    <Button onClick={handleSkillGap} disabled={skillGapLoading} size="lg" className="gap-2 px-8">
                                        {skillGapLoading
                                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Analysing…</>
                                            : <><Sparkles className="h-4 w-4" /> Analyse Skills</>}
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Skill Gap Analysis</h2>
                                    <Button variant="outline" size="sm" onClick={handleSkillGap} disabled={skillGapLoading} className="gap-2 border-border/50">
                                        {skillGapLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                                        Re-analyse
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                                    {/* Overall Score */}
                                    <Card className="border-border/50 bg-background/60 backdrop-blur-xl xl:col-span-1">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <Star className="h-4 w-4 text-primary" />
                                                Readiness Score
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex flex-col items-center gap-3 py-4">
                                                <div className="relative w-28 h-28">
                                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                        <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border)/0.4)" strokeWidth="10" />
                                                        <circle
                                                            cx="50" cy="50" r="42" fill="none"
                                                            stroke="hsl(var(--primary))"
                                                            strokeWidth="10"
                                                            strokeLinecap="round"
                                                            strokeDasharray={`${skillGap.overallScore * 2.64} 264`}
                                                            className="transition-all duration-1000"
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className="text-3xl font-extrabold tracking-tight">{skillGap.overallScore}</span>
                                                        <span className="text-xs text-muted-foreground font-medium">/ 100</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground text-center leading-relaxed">{skillGap.summary}</p>
                                        </CardContent>
                                    </Card>

                                    {/* Strengths */}
                                    <Card className="border-border/50 bg-background/60 backdrop-blur-xl xl:col-span-2">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                                Your Strengths
                                            </CardTitle>
                                            <CardDescription>Skills where you&apos;re already strong</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {skillGap.strengths.map((s, i) => (
                                                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <span className="text-sm font-semibold">{s.skill}</span>
                                                        <span className="text-xs text-muted-foreground font-medium">{s.level}%</span>
                                                    </div>
                                                    <Progress value={s.level} className="h-2 bg-border/40 [&>div]:bg-emerald-500" />
                                                    <p className="text-xs text-muted-foreground mt-1">{s.note}</p>
                                                </motion.div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Gaps */}
                                <Card className="border-border/50 bg-background/60 backdrop-blur-xl">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                            Skills to Develop
                                        </CardTitle>
                                        <CardDescription>Prioritised list of skills that will accelerate your career</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {skillGap.gaps.map((gap, i) => {
                                                const cfg = PRIORITY_CONFIG[gap.priority];
                                                return (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.08 }}
                                                        className={`p-4 rounded-xl border ${cfg.bg} space-y-2`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-semibold text-sm">{gap.skill}</span>
                                                            <Badge variant="outline" className={`${cfg.color} border-current text-xs`}>
                                                                {cfg.label}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <Clock className="h-3 w-3" />
                                                            {gap.timeToLearn}
                                                        </div>
                                                        <div className="flex flex-wrap gap-1 pt-1">
                                                            {gap.resources.map((r) => (
                                                                <span key={r} className="text-xs px-2 py-0.5 rounded-md bg-background/50 border border-border/40 text-muted-foreground">
                                                                    {r}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
