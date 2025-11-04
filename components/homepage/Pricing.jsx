'use client';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

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
        },
    ];

    const { elementRef, isVisible } = useIntersectionObserver();

    return (
        <section
            id="pricing"
            ref={elementRef}
            className="py-20 px-4"
        >
            <div className="container mx-auto">
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Simple Plans. <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Powerful Scale.</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Start from a single store — or unify your entire franchise network. Our tiers are designed to grow with your ambition.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <Card
                            key={plan.name}
                            className={`relative p-6 hover:shadow-2xl transition-all duration-300 ${
                                plan.popular
                                ? "border-4 border-primary shadow-xl scale-105 hover:scale-110"
                                : "border-2 border-primary/20 hover:-translate-y-2"
                                } ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        Recommended
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-xs text-muted-foreground mb-4 min-h-[2.5rem]">{plan.idealFor}</p>
                                <div className="mb-2">
                                    <span className="text-3xl font-bold">{plan.price}</span>
                                </div>
                                <span className="text-xs text-primary font-semibold">{plan.priceNote}</span>
                            </div>

                            <div className="mb-6">
                                <ul className="space-y-2 mb-4">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                            <span className="text-xs">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                                    <p className="text-xs text-muted-foreground italic">{plan.highlight}</p>
                                </div>
                            </div>

                            <Button
                                variant={plan.popular ? "hero" : "outline"}
                                size="default"
                                className="w-full"
                            >
                                {plan.cta}
                            </Button>
                        </Card>
                    ))}
                </div>

                <p className="text-center text-sm text-muted-foreground mt-12">
                    All plans are customizable • Contact us for detailed pricing • Flexible payment options available
                </p>
            </div>
        </section>
    );
};

export default Pricing;
