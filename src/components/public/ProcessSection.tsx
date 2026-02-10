'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Zap, Target, Code, CheckCircle } from 'lucide-react';

const steps = [
    {
        title: "Discovery & Strategy",
        description: "Deep dive into your business goals, target audience, and technical requirements to map out the perfect solution.",
        icon: Target,
        color: "from-blue-500 to-cyan-500",
    },
    {
        title: "Design & Prototyping",
        description: "Creating intuitive user flows and high-fidelity designs that align with your brand identity and users' needs.",
        icon: Zap,
        color: "from-purple-500 to-pink-500",
    },
    {
        title: "Agile Development",
        description: "Building robust, scalable applications using cutting-edge technologies like Next.js, AI, and cloud-native architectures.",
        icon: Code,
        color: "from-indigo-500 to-purple-500",
    },
    {
        title: "Launch & Optimization",
        description: "Deploying to production with a focus on speed, SEO, and security, followed by continuous monitoring and improvements.",
        icon: CheckCircle,
        color: "from-emerald-500 to-teal-500",
    },
];

export function ProcessSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section id="process" className="py-32 relative z-10 overflow-hidden" ref={containerRef}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4"
                    >
                        How I Work
                    </motion.h2>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl font-bold tracking-tight"
                    >
                        Design. <span className="text-primary">Develop.</span> Deploy.
                    </motion.h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />

                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: idx * 0.15 }}
                            className="relative z-10"
                        >
                            <Card hover glow className="h-full p-8 flex flex-col items-center text-center group bg-background/50 backdrop-blur-md">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                    <step.icon className="w-8 h-8 text-white" />
                                </div>

                                <div className="absolute top-4 right-4 text-4xl font-bold text-foreground/5 select-none">
                                    0{idx + 1}
                                </div>

                                <h4 className="text-xl font-bold mb-4">{step.title}</h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
