'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Zap, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

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

    useEffect(() => {
        async function loadData() {
            const supabase = createClient();
            const [p, s] = await Promise.all([
                supabase
                    .from('portfolios')
                    .select('*')
                    .eq('status', 'published')
                    .order('order_index', { ascending: true })
                    .limit(3),
                supabase
                    .from('services')
                    .select('*')
                    .eq('status', 'published')
                    .order('order_index', { ascending: true })
                    .limit(3),
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
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-20">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="text-left"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
                        >
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm text-primary font-medium">Available for freelance projects</span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6"
                        >
                            <span className="block text-foreground">Crafting Digital</span>
                            <span className="gradient-text">Experiences</span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10"
                        >
                            Full-stack developer specializing in building exceptional digital experiences.
                            I create modern, performant, and user-centric web applications.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Magnetic>
                                <Link
                                    href="/portfolio"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-all shadow-glow hover:shadow-glow-lg w-full sm:w-auto"
                                >
                                    View My Work
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Magnetic>
                            <Magnetic>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface border border-border rounded-xl font-medium text-foreground hover:bg-surface-hover transition-colors w-full sm:w-auto"
                                >
                                    Let&apos;s Talk
                                </Link>
                            </Magnetic>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8"
                        >
                            {[
                                { label: 'Experience', value: '5+' },
                                { label: 'Projects', value: '50+' },
                                { label: 'Clients', value: '30+' },
                                { label: 'Tech Stack', value: '20+' },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <div className="hidden lg:block relative h-[500px] w-full">
                        <Hero3D />
                    </div>
                </div>
            </section>

            {/* Services Preview */}
            {!loading && services.length > 0 && (
                <section className="py-20 relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="flex justify-between items-end mb-12"
                        >
                            <motion.div variants={itemVariants}>
                                <h2 className="text-3xl font-bold mb-4">My <span className="gradient-text">Services</span></h2>
                                <p className="text-muted-foreground">Tailored solutions for your digital needs.</p>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Link href="/services" className="text-primary hover:text-primary-hover font-medium flex items-center gap-2 transition-colors">
                                    All Services <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            {services.map((service) => {
                                const IconComponent = getIconComponent(service.icon);
                                return (
                                    <motion.div key={service.id} variants={itemVariants}>
                                        <Card hover glow className="h-full">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                                                <IconComponent className="w-6 h-6 text-primary" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                                            <p className="text-muted-foreground text-sm line-clamp-3">{service.short_description || 'Professional service tailored to your needs.'}</p>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Featured Projects */}
            {!loading && portfolios.length > 0 && (
                <section className="py-20 bg-surface/30 relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="flex justify-between items-end mb-12"
                        >
                            <motion.div variants={itemVariants}>
                                <h2 className="text-3xl font-bold mb-4">Featured <span className="gradient-text">Projects</span></h2>
                                <p className="text-muted-foreground">A selection of my recent work.</p>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Link href="/portfolio" className="text-primary hover:text-primary-hover font-medium flex items-center gap-2 transition-colors">
                                    View All <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {portfolios.map((project) => (
                                <motion.div key={project.id} variants={itemVariants}>
                                    <Link href={`/portfolio/${project.slug}`}>
                                        <Card hover glow className="group overflow-hidden p-0 h-full flex flex-col">
                                            <div className="aspect-video relative overflow-hidden bg-surface-hover">
                                                {project.featured_image ? (
                                                    <Image
                                                        src={project.featured_image}
                                                        alt={project.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Code className="w-12 h-12 text-muted" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                                    <span className="text-white font-medium flex items-center gap-2">
                                                        View Project <ArrowRight className="w-4 h-4" />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                                                <div className="flex flex-wrap gap-2 mt-auto">
                                                    {project.tech_stack?.slice(0, 3).map((tech: string) => (
                                                        <span key={tech} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-surface-hover rounded-md text-muted-foreground">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-20 relative z-10 overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 backdrop-blur-sm"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Let&apos;s Work Together</h2>
                        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                            Have a project in mind? I&apos;d love to hear about it. Let&apos;s discuss how we can bring your ideas to life.
                        </p>
                        <Magnetic>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-hover transition-all shadow-glow hover:shadow-glow-lg"
                            >
                                Start a Conversation
                                <ArrowRight className="w-6 h-6" />
                            </Link>
                        </Magnetic>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
