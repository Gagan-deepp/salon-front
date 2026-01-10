'use client';
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Quote, Sparkles, Star } from "lucide-react";
import { useState } from "react";

const Testimonials = () => {
    const [count, setCount] = useState(0);

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Owner, Luxe Salon & Spa",
            content: "RYY-NOX transformed how we handle billing. We've reduced invoice errors by 95% and saved 10+ hours weekly. The automated reminders have improved our payment collection rate significantly.",
            rating: 5,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        },
        {
            name: "Michael Chen",
            role: "Manager, FitCore Gym",
            content: "The membership management features are incredible. We can now track recurring payments, send automated billing reminders, and our members love the convenience of online payments.",
            rating: 5,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        },
        {
            name: "Priya Patel",
            role: "Director, Wellness Spa Retreat",
            content: "Customer support is exceptional, and the platform is so intuitive. We onboarded our entire team in less than an hour. The reporting features give us insights we never had before.",
            rating: 5,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        },
        {
            name: "James Rodriguez",
            role: "Owner, Elite Fitness Studio",
            content: "Best investment we've made for our business. The integration with our booking system was seamless, and the invoicing automation has freed up so much of our time to focus on clients.",
            rating: 5,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
        },
        {
            name: "Emma Williams",
            role: "Manager, Serenity Day Spa",
            content: "From package deals to gift certificates, RYY-NOX handles everything beautifully. Our revenue has increased by 30% since implementing their system. Highly recommend!",
            rating: 5,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
        },
        {
            name: "David Kim",
            role: "Owner, CrossFit Pro Gym",
            content: "The mobile app makes it easy to manage billing on the go. We can send invoices from anywhere, and clients can pay instantly. Game changer for our business operations.",
            rating: 5,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        },
    ];

    const { elementRef, isVisible } = useIntersectionObserver();

    const handleClick = () => {
        setCount(count + 1);

        if (count === 12) {
            alert("Sachin pagal!");
            setCount(0);
        }
    }

    return (
        <section
            id="testimonials"
            ref={elementRef}
            className="py-26 px-4 bg-linear-to-b from-muted/30 via-background to-muted/30 relative overflow-hidden"
        >
            {/* Minimal background elements */}
            <div className="absolute top-20 right-1/3 w-96 h-96 bg-primary/4 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-secondary/3 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="container mx-auto relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-sm font-medium text-primary mb-6" onClick={handleClick} >
                        <Sparkles className="w-4 h-4" />
                        Customer Stories
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        <span className="block text-foreground mb-2">Loved by</span>
                        <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                            Thousands of Businesses
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                        See what business owners are saying about RYY-NOX
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {testimonials.map((testimonial, index) => {
                        const accentColors = ['primary', 'secondary'];
                        const accentColor = accentColors[index % 2];

                        return (
                            <div
                                key={testimonial.name}
                                className={`group relative p-8 bg-card/60 backdrop-blur-sm border border-border/30 rounded-3xl transition-all duration-700 hover:shadow-xl hover:shadow-primary/5 ${accentColor === 'primary' ? 'hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/8 hover:to-transparent' :
                                    accentColor === 'secondary' ? 'hover:border-secondary/50 hover:bg-gradient-to-br hover:from-secondary/8 hover:to-transparent' :
                                        'hover:border-accent/50 hover:bg-gradient-to-br hover:from-accent/8 hover:to-transparent'
                                    } ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative z-10">
                                    <Quote className={`w-8 h-8 mb-6 ${accentColor === 'primary' ? 'text-primary/30' :
                                        accentColor === 'secondary' ? 'text-secondary/30' :
                                            'text-accent/30'
                                        }`} />

                                    <div className="flex mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className={`w-5 h-5 ${accentColor === 'primary' ? 'fill-primary text-primary' :
                                                accentColor === 'secondary' ? 'fill-secondary text-secondary' :
                                                    'fill-accent text-accent'
                                                }`} />
                                        ))}
                                    </div>

                                    <p className="text-base text-muted-foreground mb-8 leading-relaxed font-light">
                                        "{testimonial.content}"
                                    </p>

                                    <div className="flex items-center gap-4 pt-6 border-t border-border/30">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className={`w-12 h-12 rounded-full border-2 ${accentColor === 'primary' ? 'border-primary/20' :
                                                accentColor === 'secondary' ? 'border-secondary/20' :
                                                    'border-accent/20'
                                                }`}
                                        />
                                        <div>
                                            <p className="font-semibold text-sm text-foreground">{testimonial.name}</p>
                                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
