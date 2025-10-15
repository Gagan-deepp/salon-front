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
                            <div className="inline-flex items-center gap-2 bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 border border-primary/20">
                                <span className="text-xs sm:text-sm font-medium text-primary">🎉 Join 500+ Happy Customers</span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                                Ready to Transform Your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Billing?</span>
                            </h2>
                            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
                                Join hundreds of businesses streamlining their operations with Rynox. Start your free trial today—no credit card required.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
                                <Button variant="hero" size="xl" className="group shadow-2xl">
                                    Start Free Trial
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button variant="outline" size="xl">
                                    Schedule a Demo
                                </Button>
                            </div>

                            {/* Trust signals */}
                            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground border-t border-primary/10 pt-4 sm:pt-6">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <span className="text-primary">✓</span>
                                    <span className="whitespace-nowrap">Setup in 15 minutes</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <span className="text-primary">✓</span>
                                    <span className="whitespace-nowrap">No credit card required</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <span className="text-primary">✓</span>
                                    <span className="whitespace-nowrap">Cancel anytime</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <span className="text-primary">✓</span>
                                    <span className="whitespace-nowrap">30-day money back guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
