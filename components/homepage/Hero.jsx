'use client';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-24 md:pt-28">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="container mx-auto relative z-10">
                <div className="max-w-4xl mx-auto text-center animate-fade-in-slow">

                    {/* Main heading */}
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Command Your Network
                        </span>
                        <br />
                        <span className="text-2xl md:text-4xl lg:text-5xl">
                            The Only Billing System Built for Multi-Unit Franchise Command.
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                        Go beyond POS. Rynox centralizes every store, standardizes pricing, and delivers real-time profitability analytics — from 1 to 500 locations.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button variant="hero" size="xl" className="group shadow-2xl">
                            Request Enterprise Demo
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" size="xl" className="group">
                            See All Plans
                        </Button>
                    </div>

                    {/* Trust Signal Row */}
                    <div className="flex flex-col items-center justify-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span className="text-primary">✅</span>
                            <span>Trusted by leading brands like Femina Flaunt, Naturals, and Looks Salon</span>
                        </div>
                        {/* Logos Carousel - Placeholder for brand logos */}
                        <div className="flex items-center gap-8 mt-4 opacity-60">
                            <span className="text-xs font-semibold">FEMINA FLAUNT</span>
                            <span className="text-xs font-semibold">NATURALS</span>
                            <span className="text-xs font-semibold">LOOKS SALON</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
