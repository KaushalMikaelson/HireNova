"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

import {useEffect, useState} from "react";
import { CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LineChart } from "recharts";
const PerformanceChart = ({ assessments }: { assessments: any[] }) => {

    const [chartData, setChartData] = useState<{ date: string; score: number }[]>([]);

    useEffect(() => {
        if(assessments) {
            const formattedData = assessments.map(assessment => ({
                date: format(new Date(assessment.createdAt), "MMM dd"),
                score: assessment.quizScore
            }));
            setChartData(formattedData);
        }
    }, [assessments]);
    return (
        <Card className="border-muted-foreground/20 hover:shadow-md transition-all ease-in-out">
            <CardHeader>
                <CardTitle className="gradient-title text-3xl md:text-4xl">Performance Chart</CardTitle>
                <CardDescription>
                   Your quiz scores overtime
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]}/>
                        <Tooltip 
                        content={({ active, payload }) => {
                            if(active && payload?.length) {
                                return (
                                    <div className="bg-background p-2 border rounded-lg shadow-sm">
                                        <p className="text-sm font-medium">
                                            Score: {payload[0].value}%</p>
                                        <p className="text-sm">
                                            {payload[0].payload.date}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                        />
                        <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="white" 
                        strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default PerformanceChart;