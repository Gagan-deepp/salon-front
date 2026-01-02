'use client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, BarChart3, Database, Droplets, ArrowRight } from "lucide-react";

const features = [
    {
        icon: "🔒",
        title: "Centralized Price Lock",
        headline: "End pricing chaos.",
        description: "Instantly update services, promotions, and SKUs across 5, 50, or 500 stores from one dashboard, guaranteeing brand standardization.",
        iconComponent: Lock,
    },
    {
        icon: "📊",
        title: "Franchise Profit Audit",
        headline: "Maximize Network Profitability.",
        description: "Track performance indicators, staff incentive costs, and stock shrinkage live to instantly identify and course-correct underperforming franchise units.",
        iconComponent: BarChart3,
    },
    {
        icon: "💠",
        title: "Unified Customer Data",
        headline: "One Customer, Any Location.",
        description: "Seamlessly unify client history, appointments, and loyalty points across your entire network, driving brand-wide retention and consistent experience.",
        iconComponent: Database,
    },
    {
        icon: "🧴",
        title: "Stock Usage Control",
        headline: "Stop Product Leakage.",
        description: "Know exactly how much product each service consumes. Track product-to-service ratios at scale to minimize waste, prevent theft, and secure your inventory.",
        iconComponent: Droplets,
    },
];

const Features = () => {
    return (
        <section id="features" className="py-24 px-4 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
            
            <div className="container mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20 animate-fade-in">
                    <div className="inline-block mb-4">
                        <span className="text-sm font-semibold text-primary uppercase tracking-wider bg-primary/10 px-4 py-2 rounded-full">
                            The Command Center
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Total Control. <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Zero Chaos.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Enterprise-grade franchise management that scales with your vision
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
                    {features.map((feature, index) => (
                        <Card
                            key={feature.title}
                            className="p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border-2 border-primary/10 hover:border-primary/30 animate-fade-in group cursor-pointer bg-card/50 backdrop-blur-sm"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div className="flex items-start gap-6">
                                {/* Icon Section */}
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                                        <feature.iconComponent className="w-8 h-8 text-primary" />
                                    </div>
                                    {/* <div className="text-3xl text-center">{feature.icon}</div> */}
                                </div>
                                
                                {/* Content Section */}
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-lg font-semibold text-primary/90 mb-3">
                                        {feature.headline}
                                    </p>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
                    <Button variant="hero" size="xl" className="group shadow-2xl">
                        See How RYY-NOX Command Center Works
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Features;
