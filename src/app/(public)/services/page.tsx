import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import * as LucideIcons from 'lucide-react';
import { Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const metadata: Metadata = {
    title: 'Services',
    description: 'Explore my range of professional services from web development to UI/UX design.',
};

type IconComponent = React.ComponentType<{ className?: string }>;

function getIconComponent(iconName: string | null): IconComponent {
    if (!iconName) return Zap;
    const icons = LucideIcons as unknown as Record<string, IconComponent>;
    return icons[iconName] || Zap;
}

async function getServices() {
    const supabase = await createClient();
    const { data } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'published')
        .order('order_index', { ascending: true });

    return data || [];
}

export default async function ServicesPage() {
    const services = await getServices();

    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        My <span className="gradient-text">Services</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        I offer a comprehensive range of services to help you build and scale your digital presence.
                    </p>
                </div>

                {/* Services Grid */}
                {services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => {
                            const IconComponent = getIconComponent(service.icon);
                            return (
                                <div
                                    key={service.id}
                                    className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-glow"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
                                        <IconComponent className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-xl mb-3">{service.title}</h3>
                                    {service.short_description && (
                                        <p className="text-muted-foreground mb-4">{service.short_description}</p>
                                    )}
                                    {service.description && (
                                        <div className="prose prose-sm text-muted-foreground mt-4 pt-4 border-t border-border">
                                            <ReactMarkdown>{service.description}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">No services available yet.</p>
                    </div>
                )}

                {/* CTA */}
                <div className="mt-20 text-center p-12 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl border border-border">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Something Custom?</h2>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                        Don&apos;t see exactly what you&apos;re looking for? I&apos;m always open to discussing custom projects tailored to your specific needs.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-all shadow-glow"
                    >
                        Let&apos;s Discuss Your Project
                    </a>
                </div>
            </div>
        </div>
    );
}
