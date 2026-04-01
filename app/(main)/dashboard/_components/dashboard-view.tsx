"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, BriefcaseIcon, Brain, LineChart, Activity, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from "recharts";
import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 12 } }
};

const DashboardView = ({ insights }: { insights: any }) => {
    const salaryData = insights.salaryRanges.map((range: any) => ({
        name: range.role,
        min: range.min / 1000,
        max: range.max / 1000,
        median: range.median / 1000,
    }));

    const getDemandLevelColor = (level: string) => {
        switch (level.toLowerCase()) {
            case "high": return "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]";
            case "medium": return "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]";
            case "low": return "bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.5)]";
            default: return "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]";
        }
    };

    const getMarketOutlookInfo = (outlook: string) => {
        switch (outlook.toLowerCase()) {
            case "positive": return { icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" };
            case "neutral": return { icon: LineChart, color: "text-amber-500", bg: "bg-amber-500/10" };
            case "negative": return { icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-500/10" };
            default: return { icon: LineChart, color: "text-gray-500", bg: "bg-gray-500/10" };
        }
    };

    const OutlookInfo = getMarketOutlookInfo(insights.marketOutlook);
    const OutlookIcon = OutlookInfo.icon;

    const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
    const nextUpdateDistance = formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true });
    
    // Fallback growth value
    const growthVal = insights.growthRate ?? 0;

    return (
        <motion.div 
            className="space-y-8 pb-10"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Header section */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Industry AI Insights
                    </h1>
                    <p className="text-muted-foreground mt-1">Data-driven analysis tailored for {insights.industry || "your industry"}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Link href="/onboarding?force=true">
                        <Button variant="outline" className="border-primary/20 bg-background/50 backdrop-blur-sm">
                            Update Profile
                        </Button>
                    </Link>
                    <Badge variant="outline" className="px-3 py-1 font-medium bg-background/50 backdrop-blur-sm border-primary/20 text-primary hidden lg:inline-flex">
                        <Activity className="w-3 h-3 mr-2 animate-pulse" />
                        Last updated: {lastUpdatedDate}
                    </Badge>
                </div>
            </motion.div>

            {/* Top 4 stat cards */}
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
            >
                <motion.div variants={itemVariants}>
                    <Card className="relative overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50 bg-background/60 backdrop-blur-xl h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Market Outlook</CardTitle>
                            <div className={`p-2 rounded-xl transition-colors ${OutlookInfo.bg}`}>
                                <OutlookIcon className={`h-4 w-4 ${OutlookInfo.color} group-hover:scale-110 transition-transform`} />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-extrabold tracking-tight capitalize">{insights.marketOutlook}</div>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">Next refresh {nextUpdateDistance}</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="relative overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50 bg-background/60 backdrop-blur-xl h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Industry Growth</CardTitle>
                            <div className="p-2 rounded-xl bg-blue-500/10 transition-colors">
                                <TrendingUp className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-extrabold tracking-tight">{growthVal.toFixed(1)}%</div>
                            <Progress value={growthVal} className="mt-3 h-2 bg-blue-500/20 [&>div]:bg-blue-500" />
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="relative overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50 bg-background/60 backdrop-blur-xl h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Demand Level</CardTitle>
                            <div className="p-2 rounded-xl bg-purple-500/10 transition-colors">
                                <BriefcaseIcon className="h-4 w-4 text-purple-500 group-hover:scale-110 transition-transform" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-extrabold tracking-tight capitalize">{insights.demandLevel}</div>
                            <div className={`h-2 w-full rounded-full mt-3 transition-all duration-500 ${getDemandLevelColor(insights.demandLevel)}`} />
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="relative overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50 bg-background/60 backdrop-blur-xl h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Top Skills</CardTitle>
                            <div className="p-2 rounded-xl bg-pink-500/10 transition-colors">
                                <Brain className="h-4 w-4 text-pink-500 group-hover:scale-110 transition-transform" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="flex flex-wrap gap-2 mt-1">
                                {insights.topSkills.slice(0, 3).map((skill: string) => (
                                    <Badge key={skill} variant="secondary" className="bg-secondary/50 hover:bg-secondary transition-colors cursor-default text-xs">{skill}</Badge>
                                ))}
                                {insights.topSkills.length > 3 && (
                                    <Badge variant="outline" className="text-xs text-muted-foreground border-dashed">+{insights.topSkills.length - 3} more</Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Salary Chart Section */}
            <motion.div variants={itemVariants}>
                <Card className="w-full border-border/50 bg-background/60 backdrop-blur-xl shadow-lg hover:border-primary/20 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            Salary Ranges by Role
                        </CardTitle>
                        <CardDescription>Comprehensive view of compensation (in thousands USD)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.4)" />
                                    <XAxis 
                                        dataKey="name" 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                                        dy={10} 
                                    />
                                    <YAxis 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickFormatter={(value) => `$${value}k`}
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                        dx={-10}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-background/95 backdrop-blur-xl border border-border/50 p-4 rounded-xl shadow-2xl z-50">
                                                        <p className="font-bold text-foreground mb-3">{label}</p>
                                                        {payload.map((item) => (
                                                            <div key={item.name} className="flex items-center justify-between gap-6 mb-1 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                                    <span className="text-muted-foreground capitalize">{item.name?.toString().replace(' (K)', '')}:</span>
                                                                </div>
                                                                <span className="font-semibold text-foreground">${item.value}K</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }} 
                                    />
                                    <Bar dataKey="min" fill="#3b82f6" name="Minimum" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Bar dataKey="median" fill="#8b5cf6" name="Median" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Bar dataKey="max" fill="#ec4899" name="Maximum" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Trends & Skills - Side by Side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                <motion.div variants={itemVariants} className="h-full">
                    <Card className="w-full h-full border-border/50 bg-background/60 backdrop-blur-xl shadow-lg hover:border-primary/20 transition-all duration-300">
                        <CardHeader>
                            <CardTitle>Key Industry Trends</CardTitle>
                            <CardDescription>Transformational shifts tracking in your sector</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4 pr-4">
                                {insights.keyTrends.map((trend: string, index: number) => (
                                    <motion.li 
                                        key={index} 
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start space-x-3 group"
                                    >
                                        <div className="h-2 w-2 mt-2 rounded-full bg-primary ring-4 ring-primary/10 group-hover:scale-150 group-hover:bg-primary transition-all duration-300 shrink-0" />
                                        <span className="text-foreground/80 leading-relaxed font-medium group-hover:text-foreground transition-colors">{trend}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="h-full">
                    <Card className="w-full h-full border-border/50 bg-background/60 backdrop-blur-xl shadow-lg hover:border-primary/20 transition-all duration-300">
                        <CardHeader>
                            <CardTitle>Recommended Skills</CardTitle>
                            <CardDescription>Must-have proficiencies for role advancement</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                {insights.recommendedSkills.map((skill: string, index: number) => (
                                    <motion.div
                                        key={skill}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Badge 
                                            variant="outline" 
                                            className="px-4 py-2 text-sm bg-gradient-to-br from-background to-secondary/20 hover:from-primary/10 hover:to-primary/5 hover:border-primary/30 transition-all duration-300 cursor-default shadow-sm"
                                        >
                                            {skill}
                                        </Badge>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

        </motion.div>
    );
};

export default DashboardView;