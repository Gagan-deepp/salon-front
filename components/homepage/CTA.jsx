'use client';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
    return (
        <section className="py-26 px-4 bg-background relative overflow-hidden">
            {/* Minimal background elements */}
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/4 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary/3 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="container mx-auto relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="group relative p-12 bg-card/80 backdrop-blur-sm border border-border/30 rounded-3xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700 hover:border-primary/50">
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-sm font-medium text-primary mb-8">
                                <Sparkles className="w-4 h-4" />
                                Ready to Transform?
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                                <span className="block text-foreground mb-2">Command, Control & Scale</span>
                                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                                    With RYY-NOX
                                </span>
                            </h2>

                            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                                Experience the only system trusted by India's fastest-growing salon and retail chains to unify and maximize their franchise network.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/25 text-primary-foreground font-semibold rounded-2xl px-10 h-16 transition-all duration-300 group"
                                >
                                    Request Enterprise Demo
                                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 font-semibold rounded-2xl px-10 h-16 bg-background/80 text-foreground hover:text-foreground"
                                >
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
