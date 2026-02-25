"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRef, useEffect } from "react";

export const HeroSection = () => {
    const imageRef = useRef<HTMLDivElement | null>(null);

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

        // Initialize immediately to handle loads where the user is already scrolled down
        handleScroll();

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return <section className="w-full pt-36 md:pt-48 pb-20">
        <div className="space-y-6 text-center">
            <div className="space-y-6 mx-auto">
                <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title">
                    Your AI Career Coach for
                    <br />
                    Professional Success
                </h1>
                <p className="mx-auto max-w-[600px] text-lg text-muted-foreground md:text-xl">
                    Advance your career with personalized guidance, interview prep, and AI-powered tools for job success</p>
            </div>

            <div className="flex justify-center space-x-4">
                <Link href="https://github.com/KaushalMikaelson">
                    <Button size="lg" className="px-8">
                        Get Started
                    </Button>
                </Link>
                <Link href="https://github.com/KaushalMikaelson">
                    <Button size="lg" className="px-8" variant="outline">
                        Get Started
                    </Button>
                </Link>
            </div>

            <div className="hero-image-wrapper mt-5 md:mt-0">
                <div ref={imageRef} className="hero-image">
                    <Image
                        src="/poster1.png"
                        alt="Banner Image"
                        width={1280}
                        height={720}
                        className="rounded-lg shadow-2xl border mx-auto"
                        priority />
                </div>
            </div>
        </div>
    </section>
}

