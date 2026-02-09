import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, ExternalLink, Github, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDate } from '@/lib/utils';

interface PortfolioPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: portfolio } = await supabase
        .from('portfolios')
        .select('title, description, featured_image')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (!portfolio) {
        return { title: 'Not Found' };
    }

    return {
        title: portfolio.title,
        description: portfolio.description?.slice(0, 160) || undefined,
        openGraph: {
            title: portfolio.title,
            description: portfolio.description?.slice(0, 160) || undefined,
            images: portfolio.featured_image ? [portfolio.featured_image] : undefined,
        },
    };
}

export default async function SinglePortfolioPage({ params }: PortfolioPageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: portfolio, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (error || !portfolio) {
        notFound();
    }

    return (
        <div className="py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Portfolio
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{portfolio.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(portfolio.created_at)}</span>
                        </div>
                        {portfolio.live_url && (
                            <a
                                href={portfolio.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                View Live
                            </a>
                        )}
                        {portfolio.github_url && (
                            <a
                                href={portfolio.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors"
                            >
                                <Github className="w-4 h-4" />
                                View Source
                            </a>
                        )}
                    </div>
                </div>

                {/* Featured Image */}
                {portfolio.featured_image && (
                    <div className="aspect-video relative rounded-2xl overflow-hidden mb-8 bg-surface">
                        <Image
                            src={portfolio.featured_image}
                            alt={portfolio.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {portfolio.tech_stack.map((tech: string) => (
                        <span
                            key={tech}
                            className="px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary font-medium"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Description */}
                {portfolio.description && (
                    <div className="prose prose-lg max-w-none mb-12">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {portfolio.description}
                        </ReactMarkdown>
                    </div>
                )}

                {/* Gallery */}
                {portfolio.gallery_images && portfolio.gallery_images.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {portfolio.gallery_images.map((image: string, index: number) => (
                                <div key={index} className="aspect-video relative rounded-xl overflow-hidden bg-surface">
                                    <Image
                                        src={image}
                                        alt={`${portfolio.title} gallery image ${index + 1}`}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="mt-16 pt-8 border-t border-border text-center">
                    <p className="text-muted-foreground mb-4">Interested in working together?</p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-all shadow-glow"
                    >
                        Get in Touch
                    </Link>
                </div>
            </div>
        </div>
    );
}
