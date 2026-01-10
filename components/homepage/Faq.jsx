'use client';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Sparkles } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const FAQ = () => {
    const faqs = [
        {
            question: "How does RYY-NOX help me enforce standards across my franchise network?",
            answer: "RYY-NOX's Centralized Price Lock feature allows you to control pricing, services, and promotions from a single master dashboard. Any updates you make are instantly pushed to all franchise locations, ensuring complete brand standardization. Our Franchise Profit Audit tools let you monitor compliance in real-time, tracking performance indicators and identifying any deviations from your standards across the entire network.",
        },
        {
            question: "Can I restrict store-level access to only their own data?",
            answer: "Absolutely. RYY-NOX Enterprise tiers include sophisticated role-based access controls. You can define granular permissions for each user and location, ensuring franchise owners and staff only see data relevant to their specific store. Meanwhile, corporate administrators maintain full visibility across the network. This security architecture protects sensitive profitability data while empowering local teams with the information they need.",
        },
        {
            question: "Do you offer data migration from my existing POS software?",
            answer: "Yes! Our Dedicated Launch Team provides white-glove data migration services for all Enterprise customers. We handle the complex process of transferring your customer data, service catalogs, pricing structures, and historical records from your existing system to RYY-NOX. Our specialists work closely with your team to ensure a seamless transition with zero data loss and minimal disruption to your operations.",
        },
        {
            question: "How does the per-store fee work above the 20-unit Enterprise limit?",
            answer: "Our Full Enterprise plan is designed for networks of 20+ stores with transparent, scalable pricing. Beyond the base 20 locations, each additional store is billed at a discounted per-unit rate that decreases as your network grows. This ensures you get better value as you scale. Contact our Enterprise Specialists for a custom quote tailored to your specific network size and requirements.",
        },
        {
            question: "How secure is my sensitive customer and profitability data?",
            answer: "Security is our top priority. RYY-NOX uses enterprise-grade cloud infrastructure with 256-bit SSL encryption, multi-factor authentication, and role-based access controls. Your data is hosted on secure, redundant servers with 24x7 monitoring and automated backups. We're fully compliant with industry standards including PCI DSS and GDPR, and we conduct regular third-party security audits to ensure your customer and financial data remains protected at all times.",
        },
    ];

    const { elementRef, isVisible } = useIntersectionObserver();

    return (
        <section
            id="faq"
            ref={elementRef}
            className="py-26 px-4 bg-background relative overflow-hidden"
        >
            {/* Minimal background elements */}
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/4 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary/3 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="container mx-auto max-w-4xl relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-sm font-medium text-primary mb-6">
                        <Sparkles className="w-4 h-4" />
                        Frequently Asked Questions
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        <span className="block text-foreground mb-2">Your Questions,</span>
                        <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                            Answered.
                        </span>
                    </h2>
                </div>

                <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
                    <div className="space-y-6">
                        {faqs.map((faq, index) => {
                            const accentColors = ['primary', 'secondary', 'accent'];
                            const accentColor = accentColors[index % 3];
                            const isHighlighted = index === 1; // Highlight second FAQ instead of first

                            return (
                                <div
                                    key={index}
                                    className={`group relative backdrop-blur-sm border transition-all duration-700 hover:shadow-2xl bg-white/80 shadow-black/5 hover:shadow-black/10 hover:border-primary/50 hover:bg-linear-to-br from-primary/20 to-primary/8 border-primary/40 shadow-xl shadow-primary/10 rounded-3xl p-8`}
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        transform: `translateY(${isHighlighted ? '0px' : '0px'})`,
                                    }}
                                >
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value={`item-${index}`} className="border-none">
                                            <AccordionTrigger className="text-left hover:no-underline py-0 [&[data-state=open]>div>.icon]:rotate-45 [&[data-state=open]>div>.plus-h]:opacity-0">
                                                <div className="flex items-center justify-between w-full pr-4">
                                                    <h3 className={`text-xl font-bold transition-colors duration-300 ${isHighlighted ? 'text-foreground' : 'text-foreground group-hover:text-primary/90'
                                                        }`}>
                                                        {faq.question}
                                                    </h3>
                                                    <div className={`icon relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${accentColor === 'primary' ? 'border-primary/30 bg-primary/5' :
                                                        accentColor === 'secondary' ? 'border-secondary/30 bg-secondary/5' :
                                                            'border-accent/30 bg-accent/5'
                                                        }`}>
                                                        <span className={`plus-v absolute w-0.5 h-4 transition-all duration-300 ${accentColor === 'primary' ? 'bg-primary' :
                                                            accentColor === 'secondary' ? 'bg-secondary' :
                                                                'bg-accent'
                                                            }`} />
                                                        <span className={`plus-h absolute w-4 h-0.5 transition-all duration-300 ${accentColor === 'primary' ? 'bg-primary' :
                                                            accentColor === 'secondary' ? 'bg-secondary' :
                                                                'bg-accent'
                                                            }`} />
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-0 pt-6 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                                                <div className="space-y-4">
                                                    <p className={`text-base leading-relaxed font-medium ${isHighlighted ? 'text-foreground/80' : 'text-muted-foreground'
                                                        }`}>
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-16 text-center p-8 bg-gradient-to-br from-muted/50 to-muted/20 rounded-3xl border border-border/30">
                    <h3 className="text-2xl font-bold mb-4 text-foreground">Still have questions?</h3>
                    <p className="text-base text-muted-foreground mb-6 font-light max-w-md mx-auto">
                        Our team is here to help. Reach out anytime.
                    </p>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-2xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 group"
                    >
                        Contact our support team
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
