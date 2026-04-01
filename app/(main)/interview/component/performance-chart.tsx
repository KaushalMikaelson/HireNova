"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const PerformanceChart = ({ assessments }: { assessments: any[] }) => {
    const sortedAssessments = assessments ? [...assessments].reverse() : [];

    const chartData = sortedAssessments.map(assessment => ({
        date: format(new Date(assessment.createdAt), "MMM dd"),
        score: Number(assessment.quizScore || 0)
    }));
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-bold">Performance Chart</CardTitle>
                <CardDescription>
                    Your quiz scores overtime
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="date" 
                            />
                            <YAxis 
                                domain={[0, 100]}
                            />
                            <Tooltip 
                                content={({ active, payload }) => {
                                    if(active && payload?.length) {
                                        return (
                                            <div className="bg-background border border-border p-2 rounded-lg shadow-sm">
                                                <div className="text-sm font-bold text-foreground">
                                                    Score: {payload[0].value}%
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {payload[0].payload.date}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="score" 
                                stroke="#ffffff" 
                                strokeWidth={2}
                                dot={{ fill: "#ffffff", r: 4 }}
                                activeDot={{ r: 6, fill: "#ffffff" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default PerformanceChart;