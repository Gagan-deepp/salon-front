'use client';
import { Button } from "@/components/ui/button";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Check, Sparkles } from "lucide-react";

const Pricing = () => {
    const plans = [
        {
            name: "Solo Basic",
            idealFor: "Individual Professionals & Single Owner-Operators",
            price: "Contact Us",
            priceNote: "Low entry cost",
            features: [
                "1 User",
                "1 Store",
                "Core Billing",
                "All essential POS features",
            ],
            highlight: "Low entry cost, all essential POS features",
            cta: "Get Started",
            popular: false,
            accent: "primary",
        },
        {
            name: "Solo Advance",
            idealFor: "High-Volume Independent Stores",
            price: "Contact Us",
            priceNote: "Best for growth",
            features: [
                "3 Users",
                "Advanced Analytics",
                "Staff Pay Calculator",
                "Revenue automation tools",
            ],
            highlight: "Drives revenue growth with automation",
            cta: "Start Growing",
            popular: true,
            accent: "secondary",
        },
        {
            name: "Small Enterprise",
            idealFor: "Growing Chains (Up to 5 Units)",
            price: "Contact Us",
            priceNote: "Multi-unit control",
            features: [
                "Master Dashboard",
                "Centralized Pricing",
                "Multi-location oversight",
                "Network-wide reporting",
            ],
            highlight: "Step into multi-unit control and oversight",
            cta: "Scale Your Business",
            popular: false,
            accent: "accent",
        },
        {
            name: "Full Enterprise",
            idealFor: "National Brands (20+ Stores)",
            price: "Custom",
            priceNote: "Enterprise-grade",
            features: [
                "Central Command",
                "API Access",
                "Discounted SMS ($3)",
                "Dedicated account manager",
            ],
            highlight: "Enterprise-grade control and standardization at scale",
            cta: "Contact Sales",
            popular: false,
            accent: "primary",
        },
    ];

    const { elementRef, isVisible } = useIntersectionObserver();

    return (
        <section
            id="pricing"
            ref={elementRef}
            className="py-26 px-4 bg-linear-to-b from-muted/30 via-background to-muted/30 relative overflow-hidden"
        >
            {/* Minimal background elements */}
            <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/4 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-secondary/3 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="container mx-auto relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-sm font-medium text-primary mb-6">
                        <Sparkles className="w-4 h-4" />
                        Pricing Plans
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        <span className="block text-foreground mb-2">Simple Plans.</span>
                        <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                            Powerful Scale.
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                        Start from a single store — or unify your entire franchise network. Our tiers are designed to grow with your ambition.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {plans.map((plan, index) => {
                        const accentColor = plan.accent === 'primary' ? 'primary' :
                            plan.accent === 'secondary' ? 'secondary' : 'accent';

                        return (
                            <div
                                key={plan.name}
                                className={`group relative p-8 bg-card/60 backdrop-blur-sm border border-border/30 rounded-3xl transition-all duration-700 hover:shadow-xl hover:shadow-primary/5 ${plan.popular
                                    ? "border-primary/50 bg-gradient-to-br from-primary/8 to-transparent scale-105"
                                    : accentColor === 'primary' ? 'hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/8 hover:to-transparent' :
                                        accentColor === 'secondary' ? 'hover:border-secondary/50 hover:bg-gradient-to-br hover:from-secondary/8 hover:to-transparent' :
                                            'hover:border-accent/50 hover:bg-gradient-to-br hover:from-accent/8 hover:to-transparent'
                                    } ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                                            <Sparkles className="w-4 h-4" />
                                            Recommended
                                        </div>
                                    </div>
                                )}

                                <div className="relative z-10">
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary/90 transition-colors">{plan.name}</h3>
                                        <p className="text-sm text-muted-foreground mb-6 min-h-[2.5rem]">{plan.idealFor}</p>
                                        <div className="mb-2">
                                            <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                                        </div>
                                        <span className={`text-sm font-semibold ${accentColor === 'primary' ? 'text-primary' :
                                            accentColor === 'secondary' ? 'text-secondary' :
                                                'text-accent'
                                            }`}>{plan.priceNote}</span>
                                    </div>

                                    <div className="mb-8">
                                        <ul className="space-y-3 mb-6">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-3">
                                                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${accentColor === 'primary' ? 'text-primary' :
                                                        accentColor === 'secondary' ? 'text-secondary' :
                                                            'text-accent'
                                                        }`} />
                                                    <span className="text-sm text-foreground">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className={`p-4 rounded-2xl border ${accentColor === 'primary' ? 'bg-primary/5 border-primary/15' :
                                            accentColor === 'secondary' ? 'bg-secondary/5 border-secondary/15' :
                                                'bg-accent/5 border-accent/15'
                                            }`}>
                                            <p className="text-sm text-muted-foreground italic">{plan.highlight}</p>
                                        </div>
                                    </div>

                                    <Button
                                        variant={plan.popular ? "default" : "outline"}
                                        size="lg"
                                        className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 ${plan.popular
                                            ? "bg-linear-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25"
                                            : "hover:bg-primary/5 hover:border-primary/50"
                                            }`}
                                    >
                                        {plan.cta}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <p className="text-center text-sm text-muted-foreground mt-16 font-light">
                    All plans are customizable • Contact us for detailed pricing • Flexible payment options available
                </p>
            </div>
        </section>
    );
};

export default Pricing;
