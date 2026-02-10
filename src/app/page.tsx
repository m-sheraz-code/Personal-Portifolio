'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, Variants } from 'framer-motion';
import { ArrowRight, Code, Zap, Sparkles, Mail, Phone, Send } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect, useRef } from 'react';

import { LumosHero } from '@/components/public/LumosHero';
import { ProcessSection } from '@/components/public/ProcessSection';
import { Hero3D } from '@/components/public/Hero3D';
import { Magnetic } from '@/components/ui/Magnetic';
import { Card } from '@/components/ui/Card';

type IconComponent = React.ComponentType<{ className?: string }>;

function getIconComponent(iconName: string | null): IconComponent {
    if (!iconName) return Zap;
    const icons = LucideIcons as unknown as Record<string, IconComponent>;
    return icons[iconName] || Zap;
}

export default function HomePage() {
    const [portfolios, setPortfolios] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    useEffect(() => {
        async function loadData() {
            const supabase = createClient();
            const [p, s] = await Promise.all([
                supabase
                    .from('portfolios')
                    .select('*')
                    .eq('status', 'published')
                    .order('order_index', { ascending: true })
                    .limit(6),
                supabase
                    .from('services')
                    .select('*')
                    .eq('status', 'published')
                    .order('order_index', { ascending: true }),
            ]);
            setPortfolios(p.data || []);
            setServices(s.data || []);
            setLoading(false);
        }
        loadData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    } as any;

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 20 }
        },
    } as any;

    const textRevealVariants = {
        hidden: { y: "100%" },
        visible: {
            y: 0,
            transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] }
        }
    } as any;

    return (
        <div ref={containerRef} className="relative">
            {/* Hero Section */}
            <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-20">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="text-left"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-sm"
                        >
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm text-primary font-medium tracking-wide">Available for High-Impact Projects</span>
                        </motion.div>

                        <div className="overflow-hidden mb-6">
                            <motion.h1
                                initial="hidden"
                                animate="visible"
                                variants={textRevealVariants}
                                className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter leading-[0.9]"
                            >
                                <span className="block text-foreground mb-2">Muhammad</span>
                                <span className="gradient-text">Sheraz</span>
                            </motion.h1>
                        </div>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl sm:text-2xl text-muted-foreground max-w-xl mb-10 font-medium leading-relaxed"
                        >
                            <span className="text-foreground">Full Stack Developer</span> specialized in AI Automation & CRM Ecosystems. Building software that moves the needle.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-6"
                        >
                            <Magnetic>
                                <Link
                                    href="#portfolio"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-hover transition-all shadow-glow hover:shadow-glow-lg w-full sm:w-auto hover:-translate-y-1"
                                >
                                    Work
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </Magnetic>
                            <Magnetic>
                                <Link
                                    href="#contact"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-surface/50 border border-border backdrop-blur-md rounded-2xl font-bold text-lg text-foreground hover:bg-surface-hover transition-all w-full sm:w-auto hover:-translate-y-1"
                                >
                                    Hire Me
                                </Link>
                            </Magnetic>
                        </motion.div>
                    </motion.div>

                    <div className="hidden lg:block relative h-[600px] w-full">
                        <Hero3D />
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:block"
                >
                    <div className="w-6 h-10 border-2 border-border rounded-full flex justify-center p-1">
                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 bg-primary rounded-full"
                        />
                    </div>
                </motion.div>
            </section>

            {/* About Section */}
            <section id="about" className="py-32 relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="aspect-square relative rounded-3xl overflow-hidden border border-border shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 z-10" />
                                <div className="w-full h-full bg-surface-hover flex items-center justify-center">
                                    <Image
                                        src="/next.svg"
                                        alt="Muhammad Sheraz"
                                        width={200}
                                        height={200}
                                        className="opacity-20 grayscale"
                                    />
                                </div>
                            </div>
                            {/* Experience Badge */}
                            <div className="absolute -bottom-10 -right-10 p-8 bg-background border border-border rounded-3xl shadow-glow z-20 hidden md:block">
                                <p className="text-4xl font-bold gradient-text">3+</p>
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Years of Craft</p>
                            </div>
                        </motion.div>

                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">Inside Look</h2>
                                <h3 className="text-4xl sm:text-5xl font-bold mb-8 tracking-tight">Digital Architect & <br /><span className="gradient-text">Automation Expert</span></h3>
                                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                                    <p>
                                        I am Muhammad Sheraz, a developer who breathes life into complex digital visions. Specializing in the **MERN stack**, **Next.js**, and **AI integrations**, I bridge the gap between human needs and technical excellence.
                                    </p>
                                    <p>
                                        My expertise lies in building **high-performance web ecosystems** and **AI-driven CRM automations** that don&apos;t just work, but scale. Whether it&apos;s a complex Shopify backend or a custom Next.js dashboard, I deliver premium code with a focus on speed and security.
                                    </p>
                                </div>

                                <div className="mt-12 grid grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                                            <Code className="w-5 h-5 text-primary" /> Full-Stack
                                        </h4>
                                        <p className="text-sm">Expertise in Next.js, React, Node, and SQL/NoSQL architectures.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-primary" /> AI & CRM
                                        </h4>
                                        <p className="text-sm">Specialist in AI automation workflows and CRM system scaling.</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <ProcessSection />

            {/* Services Section */}
            <section id="services" className="py-32 bg-surface/20 relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4"
                        >
                            My Expertise
                        </motion.h2>
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-6xl font-bold tracking-tight"
                        >
                            Solutions I offer
                        </motion.h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.length > 0 ? services.map((service, idx) => {
                            const IconComponent = getIconComponent(service.icon);
                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card hover glow className="h-full p-8 group">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                                            <IconComponent className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                        <h4 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{service.title}</h4>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {service.short_description || "High-end development tailored to your specific business requirements."}
                                        </p>
                                    </Card>
                                </motion.div>
                            );
                        }) : (
                            // Fallback static items if DB empty
                            [
                                { title: "Full-Stack Development", icon: Code, desc: "MERN & Next.js solutions built for performance and scale." },
                                { title: "AI Automation", icon: Zap, desc: "Custom AI workflows to streamline your business operations." },
                                { title: "CRM Specialization", icon: Sparkles, desc: "Bespoke CRM architectures for WordPress, Shopify, and more." }
                            ].map((item, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                                    <Card hover glow className="h-full p-8 group">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                                            <item.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                        <h4 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{item.title}</h4>
                                        <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section id="portfolio" className="py-32 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4"
                            >
                                Selected Work
                            </motion.h2>
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl sm:text-7xl font-bold tracking-tighter"
                            >
                                Showcase
                            </motion.h3>
                        </div>
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            <Link href="/portfolio" className="group flex items-center gap-3 text-lg font-bold hover:text-primary transition-colors">
                                View Full Gallery <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {portfolios.map((project, idx) => (
                            <motion.div
                                key={project.id || idx}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="interactive group relative"
                            >
                                <Card hover glow className="h-full overflow-hidden border-border/50 bg-background/50 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-glow-lg">
                                    {/* Project Image */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                                                <ArrowRight className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <Image
                                            src={project.featured_image || '/next.svg'}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-8">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.tech_stack?.slice(0, 3).map((tech: string) => (
                                                <span key={tech} className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                        <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h4>
                                        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>
                                </Card>
                                <Link
                                    href={`/portfolio/${project.slug}`}
                                    className="absolute inset-0 z-20"
                                    aria-label={`View ${project.title}`}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-32 bg-surface/10 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4 text-center lg:text-left">Get In Touch</h2>
                            <h3 className="text-5xl sm:text-7xl font-bold mb-10 tracking-tighter text-center lg:text-left">Let&apos;s build <br /><span className="gradient-text">Greatness.</span></h3>

                            <div className="space-y-8 max-w-md mx-auto lg:mx-0">
                                <a href="mailto:m.sheraz.work@gmail.com" className="flex items-center gap-6 p-6 rounded-3xl bg-surface border border-border group hover:border-primary/50 transition-all">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                                        <Mail className="w-6 h-6 text-primary group-hover:text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Email Me</p>
                                        <p className="text-lg font-bold text-foreground">m.sheraz.work@gmail.com</p>
                                    </div>
                                </a>
                                <a href="tel:03164203671" className="flex items-center gap-6 p-6 rounded-3xl bg-surface border border-border group hover:border-primary/50 transition-all">
                                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary transition-colors">
                                        <Phone className="w-6 h-6 text-secondary group-hover:text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Call Me</p>
                                        <p className="text-lg font-bold text-foreground">03164203671</p>
                                    </div>
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-10 rounded-[2.5rem] bg-background border border-border shadow-2xl relative"
                        >
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground ml-2">Name</label>
                                        <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-surface border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground ml-2">Email</label>
                                        <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-surface border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground ml-2">Project Type</label>
                                    <select className="w-full px-6 py-4 bg-surface border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none text-foreground">
                                        <option>Web Development</option>
                                        <option>AI Automation</option>
                                        <option>CRM Solution</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground ml-2">Message</label>
                                    <textarea rows={4} placeholder="Describe your vision..." className="w-full px-6 py-4 bg-surface border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium resize-none text-foreground"></textarea>
                                </div>
                                <button type="button" className="w-full py-5 bg-foreground text-background rounded-2xl font-bold text-lg hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 group">
                                    Send Message
                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
