"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Brain, Target } from "lucide-react";
import { motion } from "framer-motion";

const StatsCards = ({ assessments }: { assessments: any[] }) => {
    const getAverageScore = () => {
        if (!assessments?.length) return 0;
        const total = assessments.reduce(
            (sum, assessment) => sum + assessment.quizScore, 0
        );
        return (total / assessments.length).toFixed(1);
    }

    const getLatestAssessment = () => {
        if (!assessments?.length) return null;
        return assessments[0];
    }

    const getTotalQuestions = () => {
        if (!assessments?.length) return 0;
        return assessments.reduce(
            (sum, assessment) => sum + assessment.questions.length, 0);
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 12 } }
    };

    return (
        <motion.div 
            className="grid gap-6 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={itemVariants}>
                <Card className="relative overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50 bg-background/60 backdrop-blur-xl h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                            <Target className="h-5 w-5 text-primary group-hover:scale-110 transition-transform"/>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-extrabold tracking-tight">{getAverageScore()}%</div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">Across all assessments</p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card className="relative overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50 bg-background/60 backdrop-blur-xl h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Questions Practiced</CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center transition-colors group-hover:bg-pink-500/20">
                            <Brain className="h-5 w-5 text-pink-500 group-hover:scale-110 transition-transform"/>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-extrabold tracking-tight">{getTotalQuestions()}</div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">Total Questions</p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card className="relative overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50 bg-background/60 backdrop-blur-xl h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Latest Score</CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center transition-colors group-hover:bg-orange-500/20">
                            <Trophy className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform"/>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-extrabold tracking-tight">{getLatestAssessment()?.quizScore.toFixed(1) || 0}%</div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">Latest assessment</p>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default StatsCards;