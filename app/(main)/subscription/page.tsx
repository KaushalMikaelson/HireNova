"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, StarsIcon, Zap, Shield, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { createStripeSession } from "@/actions/stripe";

export default function SubscriptionPage() {
    const [isYearly, setIsYearly] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const { url } = await createStripeSession();
            if (url) {
                router.push(url);
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-16 px-4 max-w-6xl">
            <div className="text-center space-y-4 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/30 bg-primary/5 text-primary tracking-wide text-sm mb-2 shadow-sm">
                    <Sparkles className="w-4 h-4 mr-2 inline-block" />
                    Unlock Your Career Potential
                </Badge>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent pb-2">
                    Simple, transparent pricing
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Choose the perfect plan to accelerate your job search with unlimited AI capabilities.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-3 pt-8">
                    <span className={`text-sm font-medium transition-colors ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
                    <button 
                        onClick={() => setIsYearly(!isYearly)}
                        className="relative w-[60px] h-8 rounded-full bg-secondary/60 border border-white/10 flex items-center p-1 transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                    >
                        <motion.div 
                            className="w-6 h-6 rounded-full bg-primary shadow-lg shadow-primary/40 flex items-center justify-center"
                            animate={{ x: isYearly ? 24 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                            <Zap className="w-3.5 h-3.5 text-primary-foreground" />
                        </motion.div>
                    </button>
                    <span className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
                        Yearly 
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
                            Save 20%
                        </span>
                    </span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Basic Plan */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="relative h-full border-border/50 bg-background/50 backdrop-blur-xl hover:shadow-xl hover:shadow-white/5 transition-all duration-300 flex flex-col">
                        <CardHeader className="pb-8">
                            <CardTitle className="text-2xl font-bold">Basic Track</CardTitle>
                            <CardDescription className="text-base mt-2">Perfect for casual job seekers getting started.</CardDescription>
                            <div className="mt-6 flex items-baseline text-5xl font-extrabold tracking-tight">
                                $0
                                <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-4 text-sm">
                                {[
                                    "2 AI Cover Letters per month",
                                    "Basic Resume Parsing",
                                    "Standard Interview Questions",
                                    "General Industry Insights",
                                    "Community Support",
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center">
                                        <CheckCircle2 className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                variant="outline" 
                                className="w-full h-12 text-base font-semibold border-white/10 bg-white/5 hover:bg-white/10"
                                disabled
                            >
                                Current Plan
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>

                {/* Pro Plan */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                >
                    {/* Glowing effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-500 via-pink-500 to-purple-600 rounded-2xl blur opacity-30 animate-pulse" />
                    
                    <Card className="relative h-full border-amber-500/30 bg-background/80 backdrop-blur-2xl shadow-2xl shadow-amber-500/10 flex flex-col scale-100 md:scale-105 z-10">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-amber-500/30 flex items-center gap-1 border border-white/20">
                                <StarsIcon className="w-3 h-3" /> MOST POPULAR
                            </div>
                        </div>
                        
                        <CardHeader className="pb-8">
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                                Nova Pro
                            </CardTitle>
                            <CardDescription className="text-base mt-2">Unleash the full power of AI to land your dream job faster.</CardDescription>
                            <div className="mt-6 flex items-baseline text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                                ${isYearly ? "9.99" : "14.99"}
                                <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                            </div>
                            {isYearly && <p className="text-sm text-emerald-500 mt-2 font-medium">Billed $119.88 yearly</p>}
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-4 text-sm font-medium">
                                {[
                                    { text: "Unlimited AI Cover Letters", IconComp: CheckCircle2, color: "text-amber-500" },
                                    { text: "Advanced ATS Resume Optimizations", IconComp: CheckCircle2, color: "text-amber-500" },
                                    { text: "Mock Technical & Behavioral Interviews", IconComp: CheckCircle2, color: "text-amber-500" },
                                    { text: "Hyper-personalized Industry Insights", IconComp: Sparkles, color: "text-pink-500" },
                                    { text: "Priority Auto-Apply Workflows", IconComp: Zap, color: "text-purple-500" },
                                    { text: "24/7 Dedicated Support", IconComp: Shield, color: "text-blue-500" },
                                ].map((feature) => (
                                    <li key={feature.text} className="flex items-center text-foreground/90">
                                        <feature.IconComp className={`h-5 w-5 ${feature.color} mr-3 shrink-0`} />
                                        {feature.text}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full h-12 text-base font-bold bg-gradient-to-r from-amber-500 hover:from-amber-400 to-orange-600 hover:to-orange-500 text-white shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02]"
                                onClick={handleSubscribe}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Redirecting to Stripe...
                                    </>
                                ) : (
                                    "Upgrade to Nova Pro →"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
