'use client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Users, TrendingUp, ArrowRight } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const Promise = () => {
    const promises = [
        {
            icon: Rocket,
            title: "Future-Proof Scalability",
            headline: "Expand effortlessly.",
            description: "RYY-NOX is built on a robust architecture that supports adding 1 or 100 stores overnight without performance lag or switching systems.",
            gradient: "from-blue-500 to-cyan-500",
        },
        {
            icon: Users,
            title: "Dedicated Launch Team",
            headline: "Integration, not just installation.",
            description: "Your brand receives a specialist team to manage the complex, standardized rollout across all franchise units, guaranteeing zero chaos.",
            gradient: "from-purple-500 to-pink-500",
        },
        {
            icon: TrendingUp,
            title: "Ongoing Optimization",
            headline: "Maximize Your ROI.",
            description: "We don't stop at setup. Get quarterly operational audits and dedicated account support to ensure you are continually maximizing profit from the platform.",
            gradient: "from-orange-500 to-red-500",
        },
    ];

    const { elementRef, isVisible } = useIntersectionObserver();

    return (
        <section
            id="promise"
            ref={elementRef}
            className="py-24 px-4 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
            
            <div className="container mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20 animate-fade-in">
                    <div className="inline-block mb-4">
                        <span className="text-sm font-semibold text-primary uppercase tracking-wider bg-primary/10 px-4 py-2 rounded-full">
                            The Partner Promise
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Future-Proof Your Growth <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">With RYY-NOX</span>
                    </h2>
                </div>

                {/* Promises Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
                    {promises.map((promise, index) => (
                        <Card
                            key={promise.title}
                            className={`relative p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-primary/10 hover:border-primary/30 group cursor-pointer overflow-hidden bg-card/50 backdrop-blur-sm ${
                                isVisible ? 'animate-fade-in' : 'opacity-0'
                            }`}
                            style={{ animationDelay: `${index * 200}ms` }}
                        >
                            {/* Gradient overlay on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${promise.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                            
                            <div className="relative z-10">
                                {/* Icon */}
                                <div className={`w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300`}>
                                    <promise.icon className="w-8 h-8 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                    {promise.title}
                                </h3>
                                <p className="text-lg font-semibold text-primary/90 mb-4">
                                    {promise.headline}
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    {promise.description}
                                </p>

                                {/* Decorative element */}
                                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                            </div>
                        </Card>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
                    <Button variant="hero" size="xl" className="group shadow-2xl">
                        Talk to Our Enterprise Specialists
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-sm text-muted-foreground mt-4">
                        Get a personalized demo and see how RYY-NOX can transform your franchise
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Promise;