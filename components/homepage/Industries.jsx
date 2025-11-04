'use client';
import { Card } from "@/components/ui/card";
import { Scissors, Flower2, Dumbbell } from "lucide-react";

const industries = [
    {
        icon: Scissors,
        title: "Salons & Barbers",
        description: "Command multiple outlets with unified pricing, centralized menu management, and network-wide loyalty programs.",
    },
    {
        icon: Flower2,
        title: "Spas & Wellness",
        description: "Track therapist performance, manage detailed session utilization, and optimize booking schedules across all locations.",
    },
    {
        icon: Dumbbell,
        title: "Gyms & Clinics",
        description: "Seamless membership control, appointment scheduling, and integrated product and staff incentive management.",
    },
];

const Industries = () => {
    return (
        <section className="py-12 sm:py-16 lg:py-20 px-4 bg-background" id="industries">
            <div className="container mx-auto">
                <div className="text-center mb-12 sm:mb-16 animate-fade-in">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                        Built for Every <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Beauty & Wellness Business</span>
                    </h2>
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
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{industry.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Industries;
