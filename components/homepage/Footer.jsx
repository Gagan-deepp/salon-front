'use client';
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import rynoxLogo from "@/assets/new-logo-png.png";


const Footer = () => {
    const quickLinks = [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Industries", href: "#industries" },
        { name: "Support", href: "#contact" },
    ];

    const solutions = [
        { name: "Solo Basic", href: "#pricing" },
        { name: "Solo Advance", href: "#pricing" },
        { name: "Small Enterprise", href: "#pricing" },
        { name: "Full Enterprise", href: "#pricing" },
    ];

    const brands = [
        "Femina Flaunt",
        "Naturals",
        "Looks Salon",
        "CrossFit Pro",
    ];

    const legal = [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms & Conditions", href: "/tnc" },
        { name: "Refund Policy", href: "/refund" },
        { name: "Contact Us", href: "/contact" },
    ];

    return (
        <footer className="bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
            {/* Elegant background elements */}
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/4 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary/3 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Main Footer Content */}
                <div className="py-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                        {/* Logo and Description */}
                        <div className="lg:col-span-2">
                            <Link href="#hero" className="flex items-center space-x-2 group mb-8">
                                <img
                                    src={rynoxLogo.src}
                                    alt="RYY-NOX"
                                    className="h-16 md:h-14 w-auto transition-transform group-hover:scale-105"
                                />
                            </Link>
                            <p className="text-muted-foreground mb-8 max-w-sm leading-relaxed text-base font-medium">
                                The only billing system built for multi-unit franchise command. Centralize, standardize, and scale your operations with enterprise-grade precision.
                            </p>

                            {/* Contact Cards */}
                            <div className="space-y-4">
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <span className="text-base text-muted-foreground font-medium group-hover:text-foreground transition-colors">hello@rynoxtech.com</span>
                                </div>

                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-secondary/10 text-secondary group-hover:scale-110 transition-transform duration-300">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <span className="text-base text-muted-foreground font-medium group-hover:text-foreground transition-colors">+91 (800) 123-4567</span>
                                </div>

                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform duration-300">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <span className="text-base text-muted-foreground font-medium group-hover:text-foreground transition-colors">Mumbai, India</span>
                                </div>
                            </div>
                        </div>

                        {/* Platform Links */}
                        <div className="group relative p-6 bg-card/40 backdrop-blur-sm border border-border/20 rounded-3xl hover:shadow-xl hover:shadow-primary/5 transition-all duration-700 hover:border-primary/50">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <h4 className="text-xl font-bold mb-6 text-foreground group-hover:text-primary/90 transition-colors">Platform</h4>
                                <ul className="space-y-4">
                                    {quickLinks.map((link) => (
                                        <li key={link.name}>
                                            <a href={link.href} className="text-base text-muted-foreground hover:text-primary transition-colors font-light block py-1">
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Solutions */}
                        <div className="group relative p-6 bg-card/40 backdrop-blur-sm border border-border/20 rounded-3xl hover:shadow-xl hover:shadow-secondary/5 transition-all duration-700 hover:border-secondary/50">
                            <div className="absolute inset-0 bg-gradient-to-br from-secondary/3 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <h4 className="text-xl font-bold mb-6 text-foreground group-hover:text-secondary/90 transition-colors">Solutions</h4>
                                <ul className="space-y-4">
                                    {solutions.map((solution) => (
                                        <li key={solution.name}>
                                            <a href={solution.href} className="text-base text-muted-foreground hover:text-secondary transition-colors font-light block py-1">
                                                {solution.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Trusted Brands */}
                        <div className="group relative p-6 bg-card/40 backdrop-blur-sm border border-border/20 rounded-3xl hover:shadow-xl hover:shadow-accent/5 transition-all duration-700 hover:border-accent/50">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/3 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <h4 className="text-xl font-bold mb-6 text-foreground group-hover:text-accent/90 transition-colors">Trusted By</h4>
                                <ul className="space-y-4">
                                    {brands.map((brand) => (
                                        <li key={brand} className="text-base text-muted-foreground font-light py-1">
                                            {brand}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Premium Bottom Section */}
                <div className="py-6 border-t border-border/20">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                        <div className="text-sm text-muted-foreground font-light text-center lg:text-left">
                            © 2025 RYY-NOX. All rights reserved. Built with precision for enterprise success.
                        </div>
                        <div className="flex flex-wrap gap-8 justify-center">
                            {legal.map((item) => (
                                <a key={item.name} href={item.href} className="text-base text-muted-foreground hover:text-primary transition-colors font-light hover:underline">
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
