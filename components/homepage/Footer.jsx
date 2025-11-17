'use client';
import rynoxLogo from "@/assets/rynox-logo.png";
import { Button } from "@/components/ui/button";

const Footer = () => {
    const quickLinks = [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Support", href: "#contact" },
        { name: "Careers", href: "#careers" },
    ];

    const brands = [
        "Femina Flaunt",
        "Naturals",
        "Looks Salon",
    ];

    return (
        <footer className="bg-muted/30 border-t border-border/50 py-12 sm:py-14 md:py-16 px-4">
            <div className="container mx-auto">
                {/* CTA Box */}
                <div className="mb-10 sm:mb-12">
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-2 border-primary/20 rounded-2xl p-6 sm:p-8 text-center">
                        <p className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-2">
                            Join 50,000+ businesses transforming operations with Rynox.
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Trusted by India's leading salon and retail chains
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
                    {/* Logo and description */}
                    <div className="lg:col-span-2">
                        <img src={rynoxLogo.src} alt="Rynox" className="h-10 sm:h-12 w-auto mb-3 sm:mb-4" />
                        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 max-w-sm">
                            The only billing system built for multi-unit franchise command. Centralize, standardize, and scale your operations.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Trusted Brands */}
                    <div>
                        <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Trusted By</h3>
                        <ul className="space-y-2">
                            {brands.map((brand) => (
                                <li key={brand} className="text-xs sm:text-sm text-muted-foreground">
                                    {brand}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-6 sm:pt-8 border-t border-border/50">
                    <div className="flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm text-muted-foreground gap-3">
                        <p className="text-center md:text-left">© 2025 Rynox. All rights reserved.</p>
                        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
                            <a href="#terms" className="hover:text-primary transition-colors whitespace-nowrap">Terms</a>
                            <a href="/privacy" className="hover:text-primary transition-colors whitespace-nowrap">Privacy Policy</a>
                            <a href="/refund" className="hover:text-primary transition-colors whitespace-nowrap">Refund Policy</a>

                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
