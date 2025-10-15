'use client';
import { Card } from "@/components/ui/card";
import { Receipt, Zap, Shield, BarChart3, Clock, Users } from "lucide-react";

const features = [
    {
        icon: Receipt,
        title: "Smart Invoicing",
        description: "Generate professional invoices in seconds with automated calculations and customizable templates.",
    },
    {
        icon: Zap,
        title: "Instant Payments",
        description: "Accept payments seamlessly with integrated payment gateways and real-time transaction tracking.",
    },
    {
        icon: Shield,
        title: "Secure & Compliant",
        description: "Bank-level security with automatic data backups and compliance with industry standards.",
    },
    {
        icon: BarChart3,
        title: "Analytics Dashboard",
        description: "Gain insights into your revenue, customer trends, and business performance at a glance.",
    },
    {
        icon: Clock,
        title: "Appointment Sync",
        description: "Seamlessly integrate with your booking system for automatic billing on service completion.",
    },
    {
        icon: Users,
        title: "Client Management",
        description: "Maintain detailed client profiles, payment history, and membership management in one place.",
    },
];

const Features = () => {
    return (
        <section id="features" className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
            <div className="container mx-auto">
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Everything You Need to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Succeed</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Powerful features designed specifically for service-based businesses
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <Card
                            key={feature.title}
                            className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-primary/10 hover:border-primary/30 animate-fade-in group cursor-pointer"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all">
                                <feature.icon className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
