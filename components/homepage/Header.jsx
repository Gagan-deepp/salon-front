'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import rynoxLogo from "@/assets/rynox-logo.png";
import { useScrollPosition } from "@/hooks/useScrollPosition";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { scrollY, scrollProgress } = useScrollPosition();


    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Industries", href: "#industries" },
        { name: "Pricing", href: "#pricing" },
        { name: "FAQ", href: "#faq" },
    ];

    const isScrolled = scrollY > 50;

    return (
        <>
            {/* Scroll progress indicator */}
            <div
                className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary z-50 transition-all duration-300"
                style={{ width: `${scrollProgress}%` }}
            />

            <header
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
                    ? "bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-lg"
                    : "bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <a href="#hero" className="flex items-center space-x-2 group">
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
                                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                                </a>
                            ))}
                        </nav>

                        {/* Desktop CTAs */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Button variant="ghost" size="default">
                                Sign In
                            </Button>
                            <Button variant="hero" size="default">
                                Get Started Free
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
                                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-4 py-2"
                                        onClick={() => setIsMenuOpen(false)}
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
