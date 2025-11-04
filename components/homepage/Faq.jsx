'use client';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const FAQ = () => {
    const faqs = [
        {
            question: "How does Rynox help me enforce standards across my franchise network?",
            answer: "Rynox's Centralized Price Lock feature allows you to control pricing, services, and promotions from a single master dashboard. Any updates you make are instantly pushed to all franchise locations, ensuring complete brand standardization. Our Franchise Profit Audit tools let you monitor compliance in real-time, tracking performance indicators and identifying any deviations from your standards across the entire network.",
        },
        {
            question: "Can I restrict store-level access to only their own data?",
            answer: "Absolutely. Rynox Enterprise tiers include sophisticated role-based access controls. You can define granular permissions for each user and location, ensuring franchise owners and staff only see data relevant to their specific store. Meanwhile, corporate administrators maintain full visibility across the network. This security architecture protects sensitive profitability data while empowering local teams with the information they need.",
        },
        {
            question: "Do you offer data migration from my existing POS software?",
            answer: "Yes! Our Dedicated Launch Team provides white-glove data migration services for all Enterprise customers. We handle the complex process of transferring your customer data, service catalogs, pricing structures, and historical records from your existing system to Rynox. Our specialists work closely with your team to ensure a seamless transition with zero data loss and minimal disruption to your operations.",
        },
        {
            question: "How does the per-store fee work above the 20-unit Enterprise limit?",
            answer: "Our Full Enterprise plan is designed for networks of 20+ stores with transparent, scalable pricing. Beyond the base 20 locations, each additional store is billed at a discounted per-unit rate that decreases as your network grows. This ensures you get better value as you scale. Contact our Enterprise Specialists for a custom quote tailored to your specific network size and requirements.",
        },
        {
            question: "How secure is my sensitive customer and profitability data?",
            answer: "Security is our top priority. Rynox uses enterprise-grade cloud infrastructure with 256-bit SSL encryption, multi-factor authentication, and role-based access controls. Your data is hosted on secure, redundant servers with 24x7 monitoring and automated backups. We're fully compliant with industry standards including PCI DSS and GDPR, and we conduct regular third-party security audits to ensure your customer and financial data remains protected at all times.",
        },
    ];

    const { elementRef, isVisible } = useIntersectionObserver();

    return (
        <section
            id="faq"
            ref={elementRef}
            className="py-12 sm:py-16 lg:py-20 px-4"
        >
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-12 sm:mb-16 animate-fade-in">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                        Your Questions, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Answered.</span>
                    </h2>
                </div>

                <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
                    <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border-2 border-primary/10 rounded-lg px-4 sm:px-6 hover:border-primary/30 transition-colors"
                            >
                                <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-5">
                                    <span className="text-sm sm:text-base font-semibold pr-2">{faq.question}</span>
                                </AccordionTrigger>
                                <AccordionContent className="text-sm sm:text-base text-muted-foreground pb-4 sm:pb-5">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                <div className="mt-8 sm:mt-10 md:mt-12 text-center p-6 sm:p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl sm:rounded-2xl border-2 border-primary/10">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Still have questions?</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-4">
                        Our team is here to help. Reach out anytime.
                    </p>
                    <a
                        href="#contact"
                        className="text-sm sm:text-base text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2 group"
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
