'use client';
import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const Testimonials = () => {
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Owner, Luxe Salon & Spa",
            content: "Rynox transformed how we handle billing. We've reduced invoice errors by 95% and saved 10+ hours weekly. The automated reminders have improved our payment collection rate significantly.",
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
            content: "From package deals to gift certificates, Rynox handles everything beautifully. Our revenue has increased by 30% since implementing their system. Highly recommend!",
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

    return (
        <section
            id="testimonials"
            ref={elementRef}
            className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5"
        >
            <div className="container mx-auto">
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Loved by <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Thousands</span> of Businesses
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        See what business owners are saying about Rynox
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={testimonial.name}
                            className={`p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-primary/10 ${isVisible ? 'animate-scale-in' : 'opacity-0'
                                }`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <Quote className="w-8 h-8 text-primary/30 mb-4" />

                            <div className="flex mb-3">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                ))}
                            </div>

                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full border-2 border-primary/20"
                                />
                                <div>
                                    <p className="font-semibold text-sm">{testimonial.name}</p>
                                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
