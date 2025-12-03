'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import rynoxLogo from "@/assets/rynox-logo.png";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import Link from "next/link";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { scrollY, scrollProgress } = useScrollPosition();


    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Industries", href: "#industries" },
        { name: "Pricing", href: "#pricing" },
        { name: "FAQ", href: "#faq" },
        // { name: "Contact Us", href: "/contact" },

    ];

    const isScrolled = scrollY > 50;

    const handleNavClick = (e, href) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            const headerOffset = 80; // Height of fixed header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        setIsMenuOpen(false);
    };

    return (
        <>

            <header
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
                    ? "bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-lg"
                    : "bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <a
                            href="#hero"
                            className="flex items-center space-x-2 group"
                            onClick={(e) => handleNavClick(e, '#hero')}
                        >
                            <img
                                src={rynoxLogo.src}
                                alt="Rynox"
                                className="h-8 md:h-10 w-auto transition-transform group-hover:scale-105"
                            />
                        </a>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group cursor-pointer"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                                </a>
                            ))}
                        </nav>

                        {/* Desktop CTAs */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Button variant="ghost" size="default">
                                <Link href="/login">
                                    Login
                                </Link>
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
                            <nav className="flex flex-col space-y-4">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-4 py-2 cursor-pointer"
                                        onClick={(e) => handleNavClick(e, link.href)}
                                    >
                                        {link.name}
                                    </a>
                                ))}
                                <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-border/50">
                                    <Button variant="ghost" size="default" className="w-full">
                                        Sign In
                                    </Button>
                                    <Button variant="hero" size="default" className="w-full">
                                        Get Started Free
                                    </Button>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
};

export default Header;
