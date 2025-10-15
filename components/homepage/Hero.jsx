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
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6 animate-fade-in border border-primary/20">
                        <span className="text-sm font-medium text-primary">✨ Trusted by 500+ Businesses</span>
                    </div>

                    {/* Main heading */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        Streamline Your Billing,
                        <br />
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Grow Your Business
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                        The all-in-one billing management platform designed specifically for salons, spas, and gyms.
                        Automate invoicing, track payments, and delight your clients—all in one place.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button variant="hero" size="xl" className="group shadow-2xl">
                            Get Started Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" size="xl" className="group">
                            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Watch Demo
                        </Button>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            No credit card required
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            14-day free trial
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            Cancel anytime
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
