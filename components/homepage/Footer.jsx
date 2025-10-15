'use client';
import rynoxLogo from "@/assets/rynox-logo.png";
import { Button } from "@/components/ui/button";

const Footer = () => {
    const links = {
        product: [
            { name: "Features", href: "#features" },
            { name: "Pricing", href: "#pricing" },
            { name: "Security", href: "#security" },
            { name: "Integrations", href: "#integrations" },
        ],
        company: [
            { name: "About", href: "#about" },
            { name: "Blog", href: "#blog" },
            { name: "Careers", href: "#careers" },
            { name: "Contact", href: "#contact" },
        ],
        resources: [
            { name: "Help Center", href: "#help" },
            { name: "Documentation", href: "#docs" },
            { name: "API", href: "#api" },
            { name: "Status", href: "#status" },
        ],
    };

    return (
        <footer className="bg-muted/30 border-t border-border/50 py-12 sm:py-14 md:py-16 px-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-12">
                    {/* Logo and description */}
                    <div className="lg:col-span-2">
                        <img src={rynoxLogo.src} alt="Rynox" className="h-10 sm:h-12 w-auto mb-3 sm:mb-4" />
                        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 max-w-sm">
                            Simplifying billing for service businesses worldwide. Trusted by over 500 salons, spas, and gyms.
                        </p>
                        {/* Newsletter */}
                        <div className="space-y-2">
                            <p className="text-xs sm:text-sm font-semibold">Stay Updated</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary min-w-0"
                                />
                                <Button size="sm" variant="default" className="whitespace-nowrap">Subscribe</Button>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Product</h3>
                        <ul className="space-y-2">
                            {links.product.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Company</h3>
                        <ul className="space-y-2">
                            {links.company.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Resources</h3>
                        <ul className="space-y-2">
                            {links.resources.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-6 sm:pt-8 border-t border-border/50">
                    <div className="flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 gap-3">
                        <p className="text-center md:text-left">© 2025 Rynox. All rights reserved.</p>
                        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
                            <a href="#privacy" className="hover:text-primary transition-colors whitespace-nowrap">Privacy Policy</a>
                            <a href="#terms" className="hover:text-primary transition-colors whitespace-nowrap">Terms of Service</a>
                            <a href="#cookies" className="hover:text-primary transition-colors whitespace-nowrap">Cookie Policy</a>
                        </div>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-border/30">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
                            <span className="text-primary">🔒</span>
                            <span className="whitespace-nowrap">SSL Secured</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
                            <span className="text-primary">✓</span>
                            <span className="whitespace-nowrap">PCI Compliant</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
                            <span className="text-primary">🛡️</span>
                            <span className="whitespace-nowrap">GDPR Ready</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
                            <span className="text-primary">⚡</span>
                            <span className="whitespace-nowrap">99.9% Uptime</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
