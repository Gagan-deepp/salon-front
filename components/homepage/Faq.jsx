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
            question: "How long does it take to set up Rynox?",
            answer: "Most businesses are up and running in under 15 minutes. Our intuitive setup wizard guides you through adding your services, pricing, and payment methods. You can start sending invoices on day one.",
        },
        {
            question: "Do I need a credit card to start the free trial?",
            answer: "No credit card required! We offer a full-featured 14-day free trial. You'll only be asked for payment information when you decide to upgrade to a paid plan after your trial ends.",
        },
        {
            question: "Can I import my existing client data?",
            answer: "Yes! Rynox supports CSV imports from most billing and CRM systems. Our support team can help you migrate your data smoothly, and for Enterprise customers, we provide dedicated onboarding assistance.",
        },
        {
            question: "What payment methods do you support?",
            answer: "We support all major credit cards, debit cards, ACH transfers, and digital wallets through integrations with Stripe, PayPal, and Square. Your clients can pay online instantly and securely.",
        },
        {
            question: "Is my data secure?",
            answer: "Absolutely. We use bank-level 256-bit SSL encryption for all data transmission and storage. We're PCI DSS compliant and regularly undergo security audits. Your data is backed up daily and stored in secure, redundant servers.",
        },
        {
            question: "Can I customize invoices with my branding?",
            answer: "Yes! Professional and Enterprise plans include custom branding features. Add your logo, choose your colors, customize email templates, and even use your own domain for invoice links.",
        },
        {
            question: "What kind of support do you offer?",
            answer: "All plans include email support with response times under 24 hours. Professional plans get priority support, and Enterprise customers receive 24/7 dedicated support with a dedicated account manager.",
        },
        {
            question: "Can I cancel anytime?",
            answer: "Yes, you can cancel your subscription at any time with no penalties or cancellation fees. You'll continue to have access to your account until the end of your billing period, and you can export all your data.",
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
                        Frequently Asked <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Questions</span>
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground px-4">
                        Everything you need to know about Rynox
                    </p>
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
