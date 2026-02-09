import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Briefcase, Layers, Eye, FileEdit } from 'lucide-react';
import Link from 'next/link';

async function getStats() {
    const supabase = await createClient();

    const [portfoliosResult, servicesResult] = await Promise.all([
        supabase.from('portfolios').select('status', { count: 'exact' }),
        supabase.from('services').select('status', { count: 'exact' }),
    ]);

    const portfolios = portfoliosResult.data || [];
    const services = servicesResult.data || [];

    return {
        totalPortfolios: portfolios.length,
        publishedPortfolios: portfolios.filter(p => p.status === 'published').length,
        draftPortfolios: portfolios.filter(p => p.status === 'draft').length,
        totalServices: services.length,
        publishedServices: services.filter(s => s.status === 'published').length,
        draftServices: services.filter(s => s.status === 'draft').length,
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    const statCards = [
        {
            title: 'Total Portfolios',
            value: stats.totalPortfolios,
            icon: Briefcase,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            href: '/admin/portfolios',
        },
        {
            title: 'Published Portfolios',
            value: stats.publishedPortfolios,
            icon: Eye,
            color: 'text-success',
            bgColor: 'bg-success/10',
            href: '/admin/portfolios?status=published',
        },
        {
            title: 'Total Services',
            value: stats.totalServices,
            icon: Layers,
            color: 'text-secondary',
            bgColor: 'bg-secondary/10',
            href: '/admin/services',
        },
        {
            title: 'Draft Items',
            value: stats.draftPortfolios + stats.draftServices,
            icon: FileEdit,
            color: 'text-warning',
            bgColor: 'bg-warning/10',
            href: '/admin/portfolios?status=draft',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Overview of your portfolio content</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <Link key={stat.title} href={stat.href}>
                        <Card hover glow className="h-full">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/admin/portfolios/new">
                        <Card hover className="group cursor-pointer">
                            <CardContent className="flex items-center gap-4 py-4">
                                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <Briefcase className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Add Portfolio</p>
                                    <p className="text-sm text-muted-foreground">Create a new project</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/services/new">
                        <Card hover className="group cursor-pointer">
                            <CardContent className="flex items-center gap-4 py-4">
                                <div className="p-2 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                                    <Layers className="w-5 h-5 text-secondary" />
                                </div>
                                <div>
                                    <p className="font-medium">Add Service</p>
                                    <p className="text-sm text-muted-foreground">Create a new service</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/" target="_blank">
                        <Card hover className="group cursor-pointer">
                            <CardContent className="flex items-center gap-4 py-4">
                                <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                                    <Eye className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <p className="font-medium">View Site</p>
                                    <p className="text-sm text-muted-foreground">Open public website</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
