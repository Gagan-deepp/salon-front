'use client';
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const Integrations = () => {
    const integrations = [
        { name: "Stripe", logo: "https://cdn.simpleicons.org/stripe/635BFF" },
        { name: "PayPal", logo: "https://cdn.simpleicons.org/paypal/00457C" },
        { name: "Square", logo: "https://cdn.simpleicons.org/square/000000" },
        { name: "QuickBooks", logo: "https://cdn.simpleicons.org/quickbooks/2CA01C" },
        { name: "Xero", logo: "https://cdn.simpleicons.org/xero/13B5EA" },
        { name: "Zapier", logo: "https://cdn.simpleicons.org/zapier/FF4A00" },
        { name: "Mailchimp", logo: "https://cdn.simpleicons.org/mailchimp/FFE01B" },
        { name: "Slack", logo: "https://cdn.simpleicons.org/slack/4A154B" },
    ];

    const { elementRef, isVisible } = useIntersectionObserver();

    return (
        <section
            id="integrations"
            ref={elementRef}
            className="py-12 sm:py-16 lg:py-20 px-4 bg-muted/20"
        >
            <div className="container mx-auto">
                <div className="text-center mb-12 sm:mb-16 animate-fade-in">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                        Seamless <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Integrations</span>
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                        Connect with the tools you already use and love
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {integrations.map((integration, index) => (
                            <div
                                key={integration.name}
                                className={`bg-card border-2 border-primary/10 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 flex items-center justify-center hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:scale-105 ${isVisible ? 'animate-scale-in' : 'opacity-0'
                                    }`}
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                <img
                                    src={integration.logo}
                                    alt={integration.name}
                                    className="h-8 sm:h-10 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                                    title={integration.name}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8 sm:mt-10 md:mt-12">
                        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-4">
                            Plus hundreds more integrations through our API and Zapier
                        </p>
                        <a
                            href="#contact"
                            className="text-sm sm:text-base text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2 group"
                        >
                            Explore all integrations
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Integrations;
