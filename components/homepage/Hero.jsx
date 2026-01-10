'use client';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Play, Sparkles } from "lucide-react";

const Hero = () => {
    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-24 md:pt-28">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="container mx-auto relative z-10">
                <div className="max-w-5xl mx-auto text-center animate-fade-in-slow space-y-10">

                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary">
                            <Sparkles className="w-4 h-4" />
                            <span>Enterprise Billing Platform</span>
                        </div>
                    </div>

                    {/* Main heading */}
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        <span className="block text-foreground mb-2">
                            The Only Billing System
                        </span>
                        <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                            Built for Multi-Unit Franchise Command
                        </span>
                    </h1>


                    {/* Subheading */}
                    <p className="text-center text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed font-medium">
                        Go beyond POS. RYY-NOX centralizes every store, standardizes pricing, and delivers real-time profitability analytics — from 1 to 500 locations.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 text-primary-foreground hover:text-primary-foreground font-semibold rounded-full px-8 h-14 transition-all">
                            Request Enterprise Demo
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button variant="outline" size="lg" className="border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 font-semibold rounded-full px-8 h-14 bg-white text-foreground hover:text-foreground">
                            See All Plans
                        </Button>
                    </div>


                    {/* Trust Signal Row */}
                    <div className="flex flex-col items-center justify-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-foreground/80 font-medium">Trusted by leading brands like Femina Flaunt, Naturals, and Looks Salon</span>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default Hero;
