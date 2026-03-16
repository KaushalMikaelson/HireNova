import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Brain } from "lucide-react";

const StatsCards = ({ assessments }: { assessments: any[] }) => {
    const getAverageScore = () => {
        if(!assessments?.length) return 0;
        const total = assessments.reduce(
            (sum, assessment) => sum + assessment.quizScore, 0
        );
        return (total / assessments.length).toFixed(1);
    }

    const getLatestAssessment = () => {
        if(!assessments?.length) return null;
        return assessments[0];
    }

    const getTotalQuestions = () => {
        if(!assessments?.length) return 0;
        return assessments.reduce(
            (sum, assessment) => sum + assessment.questions.length, 0);
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-md transition-all ease-in-out hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-primary"/>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{getAverageScore()}</div>
                    <p className="text-xs text-muted-foreground mt-1">Across all assessments</p>
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all ease-in-out hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Questions Practiced</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Brain className="h-4 w-4 text-primary"/>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{getTotalQuestions()}</div>
                    <p className="text-xs text-muted-foreground mt-1">Total Questions</p>
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all ease-in-out hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-primary"/>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{getLatestAssessment()?.quizScore.toFixed(1) || 0}%</div>
                    <p className="text-xs text-muted-foreground mt-1">Latest assessment</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default StatsCards