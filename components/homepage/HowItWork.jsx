'use client';
import { TrendingUp, Package, BarChart2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const HowItWorks = () => {
    const revenueEngines = [
        {
            icon: TrendingUp,
            title: "Staff Incentive Calculator",
            benefit: "Motivate performance with precision.",
            description: "Automatically calculate complex staff commissions and target-based rewards, moving your team from service providers to proactive sellers.",
            gradient: "from-primary to-secondary",
        },
        {
            icon: Package,
            title: "Advanced Stock Usage Tracking",
            benefit: "Identify the true cost per ticket.",
            description: "Go deeper than inventory counts. RYY-NOX shows the exact stock value consumed for every service, maximizing your yield and service margins.",
            gradient: "from-primary to-secondary",
        },
        {
            icon: BarChart2,
            title: "Hyper-Targeted Analytics",
            benefit: "Actionable data at your fingertips.",
            description: "Instantly drill down to your peak profit windows, top-performing services, and highest-converting staff members, all from a visual dashboard.",
            gradient: "from-primary to-secondary",
        },
    ];

    const { elementRef, isVisible } = useIntersectionObserver();

    return (
        <section
            id="how-it-works"
            ref={elementRef}
            className="py-24 px-4 bg-gradient-to-b from-muted/30 via-background to-muted/30 relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-dot-pattern opacity-5" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            
            <div className="container mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20 animate-fade-in">
                    <div className="inline-block mb-4">
                        <span className="text-sm font-semibold text-primary uppercase tracking-wider bg-primary/10 px-4 py-2 rounded-full">
                            Revenue Engines
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Boost Store Revenue With <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Smart Automation</span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Solo Advance / Growth Tier Value — Designed for actionable growth
                    </p>
                </div>

                {/* Revenue Engines Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {revenueEngines.map((engine, index) => (
                        <Card
                            key={engine.title}
                            className={`relative p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-primary/10 hover:border-primary/30 group cursor-pointer overflow-hidden ${
                                isVisible ? 'animate-fade-in' : 'opacity-0'
                            }`}
                            style={{ animationDelay: `${index * 200}ms` }}
                        >
                            {/* Gradient overlay on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${engine.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                            
                            <div className="relative z-10">
                                {/* Icon */}
                                <div className={`w-16 h-16 bg-gradient-to-br ${engine.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300`}>
                                    <engine.icon className="w-8 h-8 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                    {engine.title}
                                </h3>
                                <p className="text-lg font-semibold text-primary/90 mb-4">
                                    {engine.benefit}
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    {engine.description}
                                </p>

                                {/* Decorative element */}
                                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Bottom accent */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary" />
                        <span className="font-medium">Designed for Solo Stores & Growing Franchises</span>
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
