'use client';
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Database, Droplets, Lock, Sparkles } from "lucide-react";

const features = [
    {
        icon: "🔒",
        title: "Centralized Price Lock",
        headline: "End pricing chaos.",
        description: "Instantly update services, promotions, and SKUs across 5, 50, or 500 stores from one dashboard, guaranteeing brand standardization.",
        iconComponent: Lock,
        accent: "primary",
    },
    {
        icon: "📊",
        title: "Franchise Profit Audit",
        headline: "Maximize Network Profitability.",
        description: "Track performance indicators, staff incentive costs, and stock shrinkage live to instantly identify and course-correct underperforming franchise units.",
        iconComponent: BarChart3,
        accent: "secondary",
    },
    {
        icon: "💠",
        title: "Unified Customer Data",
        headline: "One Customer, Any Location.",
        description: "Seamlessly unify client history, appointments, and loyalty points across your entire network, driving brand-wide retention and consistent experience.",
        iconComponent: Database,
        accent: "secondary",
    },
    {
        icon: "🧴",
        title: "Stock Usage Control",
        headline: "Stop Product Leakage.",
        description: "Know exactly how much product each service consumes. Track product-to-service ratios at scale to minimize waste, prevent theft, and secure your inventory.",
        iconComponent: Droplets,
        accent: "primary",
    },
];

const Features = () => {
    return (
        <section id="features" className="py-26 px-4 bg-background relative overflow-hidden">
            {/* Minimal background elements */}
            <div className="absolute top-20 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-secondary/4 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="container mx-auto relative z-10">
                {/* Clean Section Header */}
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-sm font-medium text-primary mb-6">
                        <Sparkles className="w-4 h-4" />
                        Enterprise Command Center
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                        <span className="text-foreground block">Total Control. </span>
                        <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                            Zero Chaos.
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                        Enterprise-grade franchise management that scales with your vision
                    </p>
                </div>

                {/* Elegant Features Layout */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {features.map((feature, index) => {
                            const IconComponent = feature.iconComponent;
                            const accentColor = feature.accent === 'primary' ? 'primary' :
                                feature.accent === 'secondary' ? 'secondary' : 'accent';

                            return (
                                <div
                                    key={feature.title}
                                    className={`group relative p-10 bg-card/60 backdrop-blur-sm border border-border/30 rounded-3xl hover:bg-card/80 transition-all duration-700 hover:shadow-xl hover:shadow-primary/5 ${accentColor === 'primary' ? 'hover:border-primary/50 hover:bg-linear-to-br hover:from-primary/8 hover:to-transparent' :
                                        accentColor === 'secondary' ? 'hover:border-primary/50 hover:bg-linear-to-br hover:from-primary/8 hover:to-transparent' :
                                            'hover:border-accent/50 hover:bg-linear-to-br hover:from-accent/8 hover:to-transparent'
                                        }`}
                                    style={{ animationDelay: `${index * 200}ms` }}
                                >
                                    {/* Subtle gradient overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${accentColor === 'primary' ? 'from-primary/3 to-transparent' :
                                        accentColor === 'secondary' ? 'from-secondary/3 to-transparent' :
                                            'from-accent/3 to-transparent'
                                        } rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    <div className="relative z-10 ">
                                        {/* Minimal Icon */}
                                        <div>

                                            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-8 ${accentColor === 'primary' ? 'bg-primary/10 text-primary' :
                                                accentColor === 'secondary' ? 'bg-secondary/10 text-secondary' :
                                                    'bg-accent/10 text-accent'
                                                } group-hover:scale-110 transition-transform duration-300`}>
                                                <IconComponent className="w-7 h-7" />
                                            </div>
                                        </div>
                                        {/* Content */}
                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-bold text-foreground group-hover:text-primary/90 transition-colors duration-300">
                                                {feature.title}
                                            </h3>

                                            <p className={`text-lg font-semibold ${accentColor === 'primary' ? 'text-primary/80' :
                                                accentColor === 'secondary' ? 'text-secondary/80' :
                                                    'text-accent/80'
                                                }`}>
                                                {feature.headline}
                                            </p>

                                            <p className="text-muted-foreground text-base leading-relaxed font-light">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Refined CTA */}
                <div className="text-center mt-20">
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/25 text-primary-foreground font-semibold rounded-2xl px-10 h-16 transition-all duration-300 group"
                    >
                        See How RYY-NOX Command Center Works
                        <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Features;
