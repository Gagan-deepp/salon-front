'use client';
import { UserPlus, Settings, Zap, CheckCircle } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const HowItWorks = () => {
    const steps = [
        {
            icon: UserPlus,
            title: "Sign Up & Setup",
            description: "Create your account in under 2 minutes. No credit card required to get started.",
        },
        {
            icon: Settings,
            title: "Configure Your Services",
            description: "Add your services, pricing, and team members. Our intuitive interface makes it simple.",
        },
        {
            icon: Zap,
            title: "Start Billing",
            description: "Generate invoices, accept payments, and track revenue with just a few clicks.",
        },
        {
            icon: CheckCircle,
            title: "Grow Your Business",
            description: "Access insights, automate workflows, and focus on what matters most—your clients.",
        },
    ];

    const { elementRef, isVisible } = useIntersectionObserver();

    return (
        <section
            id="how-it-works"
            ref={elementRef}
            className="py-20 px-4 bg-muted/20"
        >
            <div className="container mx-auto">
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Get Started in <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">4 Simple Steps</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        From setup to your first invoice in minutes, not days
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Connection line for desktop */}
                    <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div
                                key={step.title}
                                className={`relative ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <div className="text-center">
                                    {/* Step number badge */}
                                    <div className="relative inline-block mb-6">
                                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110">
                                            <step.icon className="w-10 h-10 text-white" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border-2 border-primary rounded-full flex items-center justify-center text-sm font-bold text-primary">
                                            {index + 1}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
