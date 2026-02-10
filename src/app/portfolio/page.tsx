import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Code, ExternalLink, Github } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Portfolio',
    description: 'Explore my portfolio of web development projects and digital solutions.',
};

async function getPortfolios() {
    const supabase = await createClient();
    const { data } = await supabase
        .from('portfolios')
        .select('*')
        .eq('status', 'published')
        .order('order_index', { ascending: true });

    return data || [];
}

export default async function PortfolioPage() {
    const portfolios = await getPortfolios();

    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        My <span className="gradient-text">Portfolio</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        A collection of projects I&apos;ve worked on. Each project represents my commitment to quality and attention to detail.
                    </p>
                </div>

                {/* Portfolio Grid */}
                {portfolios.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {portfolios.map((portfolio) => (
                            <Link
                                key={portfolio.id}
                                href={`/portfolio/${portfolio.slug}`}
                                className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-glow"
                            >
                                {/* Image */}
                                <div className="aspect-video relative bg-surface-hover overflow-hidden">
                                    {portfolio.featured_image ? (
                                        <Image
                                            src={portfolio.featured_image}
                                            alt={portfolio.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Code className="w-12 h-12 text-muted" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                                        <div className="flex gap-2">
                                            {portfolio.live_url && (
                                                <span className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white">
                                                    <ExternalLink className="w-4 h-4" />
                                                </span>
                                            )}
                                            {portfolio.github_url && (
                                                <span className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white">
                                                    <Github className="w-4 h-4" />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                                        {portfolio.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {portfolio.tech_stack.slice(0, 4).map((tech: string) => (
                                            <span
                                                key={tech}
                                                className="px-2.5 py-1 text-xs rounded-full bg-surface text-muted-foreground"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {portfolio.tech_stack.length > 4 && (
                                            <span className="px-2.5 py-1 text-xs rounded-full bg-surface text-muted-foreground">
                                                +{portfolio.tech_stack.length - 4}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Code className="w-16 h-16 text-muted mx-auto mb-4" />
                        <p className="text-muted-foreground">No projects available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
