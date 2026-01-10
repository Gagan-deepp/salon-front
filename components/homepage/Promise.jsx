'use client';
import { Button } from "@/components/ui/button";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { ArrowRight, Rocket, Sparkles, TrendingUp, Users } from "lucide-react";

const Promise = () => {
    const promises = [
        {
            icon: Rocket,
            title: "Future-Proof Scalability",
            headline: "Expand effortlessly.",
            description: "RYY-NOX is built on a robust architecture that supports adding 1 or 100 stores overnight without performance lag or switching systems.",
            accent: "primary",
        },
        {
            icon: Users,
            title: "Dedicated Launch Team",
            headline: "Integration, not just installation.",
            description: "Your brand receives a specialist team to manage the complex, standardized rollout across all franchise units, guaranteeing zero chaos.",
            accent: "secondary",
        },
        {
            icon: TrendingUp,
            title: "Ongoing Optimization",
            headline: "Maximize Your ROI.",
            description: "We don't stop at setup. Get quarterly operational audits and dedicated account support to ensure you are continually maximizing profit from the platform.",
            accent: "accent",
        },
    ];

    const { elementRef, isVisible } = useIntersectionObserver();

    return (
        <section
            id="promise"
            ref={elementRef}
            className="py-26 px-4 bg-background relative overflow-hidden"
        >
            {/* Minimal background elements */}
            <div className="absolute top-20 left-1/3 w-96 h-96 bg-primary/4 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-secondary/3 rounded-full blur-3xl animate-pulse delay-1000" />
            
            <div className="container mx-auto relative z-10">
                {/* Clean Section Header */}
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-sm font-medium text-primary mb-6">
                        <Sparkles className="w-4 h-4" />
                        The Partner Promise
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        <span className="block text-foreground mb-2">Future-Proof Your Growth</span>
                        <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                            With RYY-NOX
                        </span>
                    </h2>
                </div>

                {/* Elegant Promises Layout */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                        {promises.map((promise, index) => {
                            const IconComponent = promise.icon;
                            const accentColor = promise.accent === 'primary' ? 'primary' :
                                promise.accent === 'secondary' ? 'secondary' : 'accent';

                            return (
                                <div
                                    key={promise.title}
                                    className={`group relative p-8 bg-card/60 backdrop-blur-sm border border-border/30 rounded-3xl transition-all duration-700 hover:shadow-xl hover:shadow-primary/5 ${accentColor === 'primary' ? 'hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/8 hover:to-transparent' :
                                        accentColor === 'secondary' ? 'hover:border-secondary/50 hover:bg-gradient-to-br hover:from-secondary/8 hover:to-transparent' :
                                            'hover:border-accent/50 hover:bg-gradient-to-br hover:from-accent/8 hover:to-transparent'
                                        } ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                                    style={{ animationDelay: `${index * 200}ms` }}
                                >
                                    <div className="relative z-10">
                                        {/* Minimal Icon */}
                                        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 ${accentColor === 'primary' ? 'bg-primary/10 text-primary' :
                                            accentColor === 'secondary' ? 'bg-secondary/10 text-secondary' :
                                                'bg-accent/10 text-accent'
                                            } group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent className="w-7 h-7" />
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-bold text-foreground group-hover:text-primary/90 transition-colors duration-300">
                                                {promise.title}
                                            </h3>

                                            <p className={`text-lg font-semibold ${accentColor === 'primary' ? 'text-primary/80' :
                                                accentColor === 'secondary' ? 'text-secondary/80' :
                                                    'text-accent/80'
                                                }`}>
                                                {promise.headline}
                                            </p>

                                            <p className="text-muted-foreground text-base leading-relaxed font-light">
                                                {promise.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Refined CTA Section */}
                <div className="text-center">
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/25 text-primary-foreground font-semibold rounded-2xl px-10 h-16 transition-all duration-300 group mb-4"
                    >
                        Talk to Our Enterprise Specialists
                        <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-sm text-muted-foreground font-light">
                        Get a personalized demo and see how RYY-NOX can transform your franchise
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Promise;