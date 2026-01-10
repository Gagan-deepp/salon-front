'use client';
import { Dumbbell, Flower2, Scissors, Sparkles } from "lucide-react";

const industries = [
    {
        icon: Scissors,
        title: "Salons & Barbers",
        description: "Command multiple outlets with unified pricing, centralized menu management, and network-wide loyalty programs.",
        accent: "primary",
    },
    {
        icon: Flower2,
        title: "Spas & Wellness",
        description: "Track therapist performance, manage detailed session utilization, and optimize booking schedules across all locations.",
        accent: "secondary",
    },
    {
        icon: Dumbbell,
        title: "Gyms & Clinics",
        description: "Seamless membership control, appointment scheduling, and integrated product and staff incentive management.",
        accent: "accent",
    },
];

const Industries = () => {
    return (
        <section className="py-26 px-4 bg-background relative overflow-hidden" id="industries">
            {/* Minimal background elements */}
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/4 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary/3 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="container mx-auto relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-sm font-medium text-primary mb-6">
                        <Sparkles className="w-4 h-4" />
                        Industry Solutions
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        <span className="block text-foreground mb-2">Built for Every</span>
                        <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                            Beauty & Wellness Business
                        </span>
                    </h2>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {industries.map((industry, index) => {
                            const IconComponent = industry.icon;
                            const accentColor = industry.accent === 'primary' ? 'primary' :
                                industry.accent === 'secondary' ? 'secondary' : 'accent';

                            return (
                                <div
                                    key={industry.title}
                                    className={`group relative p-8 bg-card/60 backdrop-blur-sm border border-border/30 rounded-3xl transition-all duration-700 hover:shadow-xl hover:shadow-primary/5 ${accentColor === 'primary' ? 'hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/8 hover:to-transparent' :
                                        accentColor === 'secondary' ? 'hover:border-secondary/50 hover:bg-gradient-to-br hover:from-secondary/8 hover:to-transparent' :
                                            'hover:border-accent/50 hover:bg-gradient-to-br hover:from-accent/8 hover:to-transparent'
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
                                                {industry.title}
                                            </h3>

                                            <p className="text-muted-foreground text-base leading-relaxed font-light">
                                                {industry.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Industries;
