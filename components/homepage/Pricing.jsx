'use client';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const Pricing = () => {
    const plans = [
        {
            name: "Starter",
            price: "29",
            description: "Perfect for small businesses just getting started",
            features: [
                "Up to 50 clients",
                "Unlimited invoices",
                "Email support",
                "Basic reporting",
                "Payment processing",
            ],
            cta: "Start Free Trial",
            popular: false,
        },
        {
            name: "Professional",
            price: "79",
            description: "For growing businesses with advanced needs",
            features: [
                "Up to 500 clients",
                "Unlimited invoices",
                "Priority support",
                "Advanced analytics",
                "Payment processing",
                "Custom branding",
                "Team collaboration",
                "API access",
            ],
            cta: "Start Free Trial",
            popular: true,
        },
        {
            name: "Enterprise",
            price: "199",
            description: "For large operations requiring maximum power",
            features: [
                "Unlimited clients",
                "Unlimited invoices",
                "24/7 dedicated support",
                "Advanced analytics & AI insights",
                "Payment processing",
                "Custom branding",
                "Team collaboration",
                "API access",
                "Custom integrations",
                "Onboarding assistance",
            ],
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
                        Simple, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Transparent Pricing</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Choose the perfect plan for your business. All plans include 14-day free trial.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <Card
                            key={plan.name}
                            className={`relative p-8 hover:shadow-2xl transition-all duration-300 ${plan.popular
                                ? "border-4 border-primary shadow-xl scale-105 hover:scale-110"
                                : "border-2 border-primary/20 hover:-translate-y-2"
                                } ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                        <Sparkles className="w-4 h-4" />
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-bold">${plan.price}</span>
                                    <span className="text-muted-foreground">/month</span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.popular ? "hero" : "outline"}
                                size="lg"
                                className="w-full"
                            >
                                {plan.cta}
                            </Button>
                        </Card>
                    ))}
                </div>

                <p className="text-center text-sm text-muted-foreground mt-12">
                    All plans include 14-day free trial • No credit card required • Cancel anytime
                </p>
            </div>
        </section>
    );
};

export default Pricing;
