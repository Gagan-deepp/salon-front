'use client';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
    return (
        <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            <div className="container mx-auto">
                <div className="max-w-4xl mx-auto text-center animate-fade-in">
                    <div className="bg-card border-2 border-primary/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                        {/* Background gradient effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />

                        <div className="relative z-10">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                                Command, Control & Scale — <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">With RYY-NOX.</span>
                            </h2>
                            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
                                Experience the only system trusted by India's fastest-growing salon and retail chains to unify and maximize their franchise network.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                                <Button variant="hero" size="xl" className="group shadow-2xl">
                                    Request Enterprise Demo
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button variant="outline" size="xl">
                                    Explore All Plans
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
