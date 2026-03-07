"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const HeroSection = () => {
    const imageRef = useRef<HTMLDivElement | null>(null);
    const { scrollY } = useScroll();
    const yTransform = useTransform(scrollY, [0, 500], [0, 100]);
    const opacityTransform = useTransform(scrollY, [0, 300], [1, 0.5]);

    useEffect(() => {
        const handleScroll = () => {
            const imageElement = imageRef.current;
            if (!imageElement) return;

            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if (scrollPosition > scrollThreshold) {
                imageElement.classList.add("scrolled");
            } else {
                imageElement.classList.remove("scrolled");
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Animation variants
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.15,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            },
        }),
    };

    return (
        <section className="w-full pt-24 md:pt-32 pb-20 overflow-hidden relative">
            <div className="space-y-8 text-center px-4 md:px-6 relative z-10">

                <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    variants={fadeUpVariants}
                    className="space-y-6 mx-auto max-w-4xl"
                >
                    <h1 className="text-5xl font-extrabold md:text-6xl lg:text-7xl xl:text-8xl tracking-tighter gradient-title drop-shadow-lg leading-[1.1]">
                        Your AI Career Coach for
                        <br className="hidden sm:block" />
                        Professional Success
                    </h1>
                    <p className="mx-auto max-w-[640px] text-lg text-muted-foreground/90 md:text-xl font-medium leading-relaxed">
                        Advance your career with personalized guidance, interview prep, and AI-powered tools for job success
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={1}
                    variants={fadeUpVariants}
                    className="flex justify-center space-x-4 pt-6"
                >
                    <Link href="https://github.com/KaushalMikaelson">
                        <Button size="lg" className="px-8 h-12 rounded-xl font-bold shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)] hover:shadow-[0_0_60px_-15px_rgba(139,92,246,0.7)] hover:-translate-y-1 transition-all duration-300">
                            Get Started
                        </Button>
                    </Link>
                    <Link href="https://github.com/KaushalMikaelson">
                        <Button size="lg" className="px-8 h-12 rounded-xl font-bold border border-border/50 bg-background/50 backdrop-blur-xl shadow-sm hover:bg-muted/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300" variant="outline">
                            Learn More
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    className="hero-image-wrapper mt-12 md:mt-16 mx-auto max-w-6xl px-4"
                >
                    <div ref={imageRef} className="hero-image relative rounded-2xl p-2 bg-gradient-to-b from-white/10 to-transparent border border-white/5 shadow-2xl backdrop-blur-sm">
                        <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full mix-blend-screen opacity-50"></div>
                        <Image
                            src="/poster1.png"
                            alt="Banner Image"
                            width={1280}
                            height={720}
                            className="rounded-xl shadow-2xl border border-border/50 ring-1 ring-white/10 object-cover w-full h-auto transition-transform duration-700 hover:scale-[1.01]"
                            priority
                        />
                    </div>
                </motion.div>
            </div>

            {/* Background floating elements */}
            <motion.div style={{ y: yTransform, opacity: opacityTransform }} className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none"></motion.div>
            <motion.div style={{ y: useTransform(scrollY, [0, 500], [0, -100]) }} className="absolute top-[40%] right-[10%] w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none"></motion.div>
        </section>
    );
}
