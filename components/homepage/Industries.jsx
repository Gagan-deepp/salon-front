'use client';
import { Card } from "@/components/ui/card";
import { Scissors, Flower2, Dumbbell } from "lucide-react";

const industries = [
    {
        icon: Scissors,
        title: "Salons",
        description: "Manage walk-ins, appointments, product sales, and stylist commissions effortlessly.",
        features: ["Staff commission tracking", "Product inventory", "Service packages"],
    },
    {
        icon: Flower2,
        title: "Spas",
        description: "Handle membership tiers, treatment packages, and retail sales with ease.",
        features: ["Membership management", "Package deals", "Treatment tracking"],
    },
    {
        icon: Dumbbell,
        title: "Gyms",
        description: "Automate recurring memberships, class bookings, and personal training sessions.",
        features: ["Recurring billing", "Class schedules", "Trainer sessions"],
    },
];

const Industries = () => {
    return (
        <section className="py-12 sm:py-16 lg:py-20 px-4 bg-background">
            <div className="container mx-auto">
                <div className="text-center mb-12 sm:mb-16 animate-fade-in">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                        Built for Your Industry
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                        Tailored features for service-based businesses
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {industries.map((industry, index) => (
                        <Card
                            key={index}
                            className="p-5 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-card to-muted/20 animate-fade-in"
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 sm:mb-5 lg:mb-6 shadow-lg">
                                <industry.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{industry.title}</h3>
                            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{industry.description}</p>
                            <ul className="space-y-1.5 sm:space-y-2">
                                {industry.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-xs sm:text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Industries;
