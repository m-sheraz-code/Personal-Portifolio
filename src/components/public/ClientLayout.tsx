'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

import { SmoothScroll } from '@/components/ui/SmoothScroll';
import { BackgroundAnimation } from '@/components/public/BackgroundAnimation';
import { PageTransition } from '@/components/public/PageTransition';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
];

const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/m-sheraz-code', icon: Github },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { name: 'Email', href: 'mailto:m.sheraz.work@gmail.com', icon: Mail },
];

function Header() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
            setIsOpen(false);
        }
    };

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled
                    ? 'bg-background/80 backdrop-blur-lg border-b border-border'
                    : 'bg-transparent'
            )}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center transition-transform group-hover:scale-105 shadow-glow">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-foreground text-lg tracking-tight leading-none">Muhammad Sheraz</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-medium">Digital Architect</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-10">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={(e) => scrollToSection(e, item.href)}
                                className={cn(
                                    'text-sm font-medium transition-colors relative hover:text-primary',
                                    pathname === item.href
                                        ? 'text-primary'
                                        : 'text-muted-foreground'
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <Link
                            href="#contact"
                            onClick={(e) => scrollToSection(e, '#contact')}
                            className="px-6 py-2.5 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary-hover transition-all shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5"
                        >
                            Let's Talk
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border py-8 px-4 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={(e) => scrollToSection(e, item.href)}
                                className={cn(
                                    'text-lg font-medium transition-colors py-2 border-b border-border/50',
                                    pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href="#contact"
                            onClick={(e) => scrollToSection(e, '#contact')}
                            className="px-4 py-4 bg-primary text-white rounded-xl font-medium text-center shadow-glow"
                        >
                            Get in Touch
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
}

function Footer() {
    return (
        <footer className="border-t border-border bg-surface/30 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <span className="font-bold text-foreground text-xl">Muhammad Sheraz</span>
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                            Crafting high-performance digital solutions with MERN, Next.js, and AI. Specialist in CRM architectures and automated business workflows.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-6 text-sm uppercase tracking-widest">Navigation</h3>
                        <ul className="space-y-4">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-6 text-sm uppercase tracking-widest">Connect</h3>
                        <div className="flex flex-wrap gap-4">
                            {socialLinks.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-xl bg-surface-hover text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all hover:scale-110 shadow-sm"
                                    aria-label={item.name}
                                >
                                    <item.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                        <div className="mt-8">
                            <p className="text-sm text-muted-foreground mb-2">Call me:</p>
                            <a href="tel:03164203671" className="text-foreground font-medium hover:text-primary transition-colors">03164203671</a>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Muhammad Sheraz. Built with Next.js & Three.js.
                    </p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
                            Privacy
                        </Link>
                        <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) return <>{children}</>;

    return (
        <SmoothScroll>
            <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-background">
                <BackgroundAnimation />
                <Header />
                <main className="flex-1 relative z-10">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </main>
                <Footer />
            </div>
        </SmoothScroll>
    );
}
