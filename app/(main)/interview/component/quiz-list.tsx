"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { i } from "framer-motion/client";
import { useRouter } from "next/navigation"
import { format } from "date-fns";
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import QuizResult from "./quiz-result";

const QuizList = ({ assessments }: { assessments: any[] }) => {

    const router = useRouter();
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row  items-center justify-between">
                    <div>
                    <CardTitle className="gradient-title text-3xl md:text-4xl">Recent Quizes</CardTitle>
                    <CardDescription>
                    Review your past assessments 
                </CardDescription>
                    </div>

                    <Button onClick={() => router.push("/interview/mock")}>Start New Quiz</Button>
                </CardHeader>
                
                <CardContent>
                    <div className="space-y-4">
                        {assessments.map((assessment, i) => {
                            return (
                                <Card 
                                key={assessment.id}
                                className="cursor-pointer hover:bg-muted/80 transition-colors"
                                onClick={() => setSelectedQuiz(assessment)}
                                >
                                    <CardHeader>
                                        <CardTitle>Quiz {i + 1} </CardTitle>
                                        <CardDescription className="flex justify-between w-full space-y-2"> 
                                            <div>
                                                Score: {assessment.quizScore.toFixed(1)}%
                                            </div>
                                            <div>
                                                Date: {format(new Date(assessment.createdAt), "MMM dd, yyyy HH:mm")}
                                            </div>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{assessment.improvementTip}</p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
                
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                        
                    </DialogHeader>
                    <QuizResult
                        result={selectedQuiz}
                        onStartNew={() => router.push("/interview/mock")}
                        hideStartNew
                    />
                </DialogContent>
            </Dialog>
        </>
    )   
}

export default QuizList