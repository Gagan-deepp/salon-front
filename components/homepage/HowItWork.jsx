'use client';
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { BarChart2, Package, Sparkles, TrendingUp } from "lucide-react";

const HowItWorks = () => {
    const revenueEngines = [
        {
            icon: TrendingUp,
            title: "Staff Incentive Calculator",
            benefit: "Motivate performance with precision.",
            description: "Automatically calculate complex staff commissions and target-based rewards, moving your team from service providers to proactive sellers.",
            accent: "primary",
        },
        {
            icon: Package,
            title: "Advanced Stock Usage Tracking",
            benefit: "Identify the true cost per ticket.",
            description: "Go deeper than inventory counts. RYY-NOX shows the exact stock value consumed for every service, maximizing your yield and service margins.",
            accent: "secondary",
        },
        {
            icon: BarChart2,
            title: "Hyper-Targeted Analytics",
            benefit: "Actionable data at your fingertips.",
            description: "Instantly drill down to your peak profit windows, top-performing services, and highest-converting staff members, all from a visual dashboard.",
            accent: "primary",
        },
    ];

    const { elementRef, isVisible } = useIntersectionObserver();

    return (
        <section
            id="how-it-works"
            ref={elementRef}
            className="py-24 px-4 bg-linear-to-b from-muted/30 via-background to-muted/30 relative overflow-hidden"
        >
            {/* Minimal background elements */}
            <div className="absolute top-20 right-1/3 w-96 h-96 bg-primary/4 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-secondary/3 rounded-full blur-3xl animate-pulse delay-1000" />
            
            <div className="container mx-auto relative z-10">
                {/* Clean Section Header */}
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-sm font-medium text-primary mb-6">
                        <Sparkles className="w-4 h-4" />
                        Revenue Engines
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        <span className="block text-foreground mb-2">Boost Store Revenue With</span>
                        <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                            Smart Automation
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                        Solo Advance / Growth Tier Value — Designed for actionable growth
                    </p>
                </div>

                {/* Elegant Revenue Engines Layout */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {revenueEngines.map((engine, index) => {
                            const IconComponent = engine.icon;
                            const accentColor = engine.accent === 'primary' ? 'primary' :
                                engine.accent === 'secondary' ? 'secondary' : 'accent';

                            return (
                                <div
                                    key={engine.title}
                                    className={`group relative p-8 bg-card/60 backdrop-blur-sm border border-border/30 rounded-3xl transition-all duration-700 hover:shadow-xl hover:shadow-primary/5 ${accentColor === 'primary' ? 'hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/8 hover:to-transparent' :
                                        accentColor === 'secondary' ? 'hover:border-secondary/50 hover:bg-gradient-to-br hover:from-secondary/8 hover:to-transparent' :
                                            'hover:border-accent/50 hover:bg-gradient-to-br hover:from-accent/8 hover:to-transparent'
                                        } ${isVisible ? 'animate-fade-in' : 'opacity-0'
                                        }`}
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
                                                {engine.title}
                                            </h3>

                                            <p className={`text-lg font-semibold ${accentColor === 'primary' ? 'text-primary/80' :
                                                accentColor === 'secondary' ? 'text-secondary/80' :
                                                    'text-accent/80'
                                                }`}>
                                                {engine.benefit}
                                            </p>

                                            <p className="text-muted-foreground text-base leading-relaxed font-light">
                                                {engine.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Refined Bottom Accent */}
                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-3 text-sm text-muted-foreground font-medium">
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/50 to-primary" />
                        <span>Designed for Solo Stores & Growing Franchises</span>
                        <div className="w-16 h-px bg-gradient-to-l from-transparent via-primary/50 to-primary" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
