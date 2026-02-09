'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ServiceFormData } from '@/lib/types';
import { Button, Input, Textarea, Card, Toggle } from '@/components/ui';
import { IconPicker } from '@/components/ui/IconPicker';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface ServiceFormProps {
    initialData?: ServiceFormData & { id?: string };
    isEdit?: boolean;
}

export default function ServiceForm({ initialData, isEdit = false }: ServiceFormProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<ServiceFormData>({
        title: initialData?.title || '',
        short_description: initialData?.short_description || '',
        description: initialData?.description || '',
        icon: initialData?.icon || '',
        status: initialData?.status || 'draft',
    });

    const handleInputChange = (field: keyof ServiceFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const supabase = createClient();

            if (isEdit && initialData?.id) {
                const { error } = await supabase
                    .from('services')
                    .update({
                        title: formData.title,
                        short_description: formData.short_description || null,
                        description: formData.description || null,
                        icon: formData.icon || null,
                        status: formData.status,
                    })
                    .eq('id', initialData.id);

                if (error) throw error;
            } else {
                // Get max order_index
                const { data: maxOrder } = await supabase
                    .from('services')
                    .select('order_index')
                    .order('order_index', { ascending: false })
                    .limit(1)
                    .single();

                const newOrderIndex = (maxOrder?.order_index ?? -1) + 1;

                const { error } = await supabase.from('services').insert({
                    title: formData.title,
                    short_description: formData.short_description || null,
                    description: formData.description || null,
                    icon: formData.icon || null,
                    status: formData.status,
                    order_index: newOrderIndex,
                });

                if (error) throw error;
            }

            router.push('/admin/services');
            router.refresh();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to save service';
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/services">
                        <Button variant="ghost" size="sm" type="button">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            {isEdit ? 'Edit Service' : 'New Service'}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {isEdit ? 'Update your service offering' : 'Create a new service offering'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Toggle
                        checked={formData.status === 'published'}
                        onChange={(checked) =>
                            handleInputChange('status', checked ? 'published' : 'draft')
                        }
                        label={formData.status === 'published' ? 'Published' : 'Draft'}
                    />
                    <Button type="submit" isLoading={saving}>
                        <Save className="w-4 h-4" />
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-error/10 border border-error/20 text-error">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 space-y-4">
                        <Input
                            label="Title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Web Development"
                            required
                        />

                        <Input
                            label="Short Description"
                            value={formData.short_description}
                            onChange={(e) => handleInputChange('short_description', e.target.value)}
                            placeholder="Brief tagline for the service"
                            hint="Displayed on the services overview page"
                        />

                        <Textarea
                            label="Full Description (Markdown)"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Describe this service in detail..."
                            className="min-h-[200px] font-mono text-sm"
                            hint="Supports Markdown formatting"
                        />
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <IconPicker
                            value={formData.icon}
                            onChange={(icon) => handleInputChange('icon', icon)}
                        />
                    </Card>
                </div>
            </div>
        </form>
    );
}
