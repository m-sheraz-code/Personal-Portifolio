import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Articles and insights about web development, design, and technology.',
};

export default function BlogPage() {
    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Blog</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Thoughts, tutorials, and insights about web development, design, and technology.
                    </p>
                </div>

                {/* Coming Soon */}
                <div className="max-w-2xl mx-auto text-center py-20">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
                    <p className="text-muted-foreground mb-8">
                        I&apos;m currently working on some amazing articles about web development,
                        design patterns, and the latest technologies. Stay tuned!
                    </p>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Clock className="w-5 h-5" />
                        <span>Check back soon for new content</span>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <p className="text-muted-foreground mb-4">In the meantime, check out my work</p>
                    <Link
                        href="/portfolio"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-colors font-medium"
                    >
                        View Portfolio
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
