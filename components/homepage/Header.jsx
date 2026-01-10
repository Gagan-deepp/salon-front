"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useScrollPosition } from "@/hooks/useScrollPosition"
import Link from "next/link"
import rynoxLogo from "@/assets/new-logo-png.png";


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { scrollY } = useScrollPosition()

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Industries", href: "#industries" },
        { name: "Pricing", href: "#pricing" },
        { name: "FAQ", href: "#faq" },
    ]

    const isScrolled = scrollY > 20

    const handleNavClick = (e, href) => {
        e.preventDefault()
        const element = document.querySelector(href)
        if (element) {
            const headerOffset = 80
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            })
        }
        setIsMenuOpen(false)
    }

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? "py-2" : "py-4"}`}>
                <div className="container mx-auto px-4 md:px-6">
                    <div
                        className={`flex items-center justify-between h-16 px-6 rounded-2xl transition-all duration-500 ${isScrolled
                            ? "bg-white/80 backdrop-blur-xl border border-primary/10 shadow-lg shadow-primary/5"
                            : "bg-white/40 backdrop-blur-md border border-primary/5 shadow-sm"
                            }`}
                    >
                        {/* Logo with bold styling */}
                        <a
                            href="#hero"
                            className="flex items-center space-x-2 group"
                            onClick={(e) => handleNavClick(e, '#hero')}
                        >
                            <img
                                src={rynoxLogo.src}
                                alt="Rynox"
                                className="h-18 md:h-14 w-auto transition-transform group-hover:scale-105"
                            />
                        </a>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors relative group cursor-pointer"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 group-hover:w-full" />
                                </a>
                            ))}
                        </nav>

                        {/* Desktop CTAs */}
                        <div className="hidden md:flex items-center gap-3">
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground font-semibold rounded-full px-6 h-10">
                                <Link href="/login">Login</Link>
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
                        <div className="md:hidden mt-3 py-6 px-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-primary/10 animate-fade-in">
                            <nav className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors px-2 py-2 cursor-pointer"
                                        onClick={(e) => handleNavClick(e, link.href)}
                                    >
                                        {link.name}
                                    </a>
                                ))}
                                <div className="flex flex-col gap-2 pt-4 border-t border-primary/10 mt-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start text-foreground/70 hover:text-primary/90"
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground font-medium"
                                    >
                                        Get Started
                                    </Button>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>
        </>
    )
}

export default Header

