'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { PortfolioFormData } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { Button, Input, Textarea, Card, Toggle, Badge } from '@/components/ui';
import { ArrowLeft, Upload, X, Plus, Save, Eye } from 'lucide-react';
import Link from 'next/link';

interface PortfolioFormProps {
    initialData?: PortfolioFormData & { id?: string };
    isEdit?: boolean;
}

export default function PortfolioForm({ initialData, isEdit = false }: PortfolioFormProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<PortfolioFormData>({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        tech_stack: initialData?.tech_stack || [],
        featured_image: initialData?.featured_image || null,
        gallery_images: initialData?.gallery_images || [],
        live_url: initialData?.live_url || '',
        github_url: initialData?.github_url || '',
        status: initialData?.status || 'draft',
    });

    const [newTech, setNewTech] = useState('');
    const [uploading, setUploading] = useState(false);

    // Auto-generate slug from title
    useEffect(() => {
        if (!isEdit && formData.title) {
            setFormData((prev) => ({
                ...prev,
                slug: slugify(prev.title),
            }));
        }
    }, [formData.title, isEdit]);

    const handleInputChange = useCallback((field: keyof PortfolioFormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleAddTech = useCallback(() => {
        if (newTech.trim() && !formData.tech_stack.includes(newTech.trim())) {
            setFormData((prev) => ({
                ...prev,
                tech_stack: [...prev.tech_stack, newTech.trim()],
            }));
            setNewTech('');
        }
    }, [newTech, formData.tech_stack]);

    const handleRemoveTech = useCallback((tech: string) => {
        setFormData((prev) => ({
            ...prev,
            tech_stack: prev.tech_stack.filter((t) => t !== tech),
        }));
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const supabase = createClient();

        try {
            for (const file of Array.from(files)) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `portfolios/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('portfolio-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('portfolio-images')
                    .getPublicUrl(filePath);

                if (isGallery) {
                    setFormData((prev) => ({
                        ...prev,
                        gallery_images: [...prev.gallery_images, publicUrl],
                    }));
                } else {
                    setFormData((prev) => ({
                        ...prev,
                        featured_image: publicUrl,
                    }));
                }
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = useCallback((url: string, isGallery = false) => {
        if (isGallery) {
            setFormData((prev) => ({
                ...prev,
                gallery_images: prev.gallery_images.filter((img) => img !== url),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                featured_image: null,
            }));
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const supabase = createClient();

            if (isEdit && initialData?.id) {
                const { error } = await supabase
                    .from('portfolios')
                    .update({
                        title: formData.title,
                        slug: formData.slug,
                        description: formData.description,
                        tech_stack: formData.tech_stack,
                        featured_image: formData.featured_image,
                        gallery_images: formData.gallery_images,
                        live_url: formData.live_url || null,
                        github_url: formData.github_url || null,
                        status: formData.status,
                    })
                    .eq('id', initialData.id);

                if (error) throw error;
            } else {
                // Get max order_index
                const { data: maxOrder } = await supabase
                    .from('portfolios')
                    .select('order_index')
                    .order('order_index', { ascending: false })
                    .limit(1)
                    .single();

                const newOrderIndex = (maxOrder?.order_index ?? -1) + 1;

                const { error } = await supabase.from('portfolios').insert({
                    title: formData.title,
                    slug: formData.slug,
                    description: formData.description,
                    tech_stack: formData.tech_stack,
                    featured_image: formData.featured_image,
                    gallery_images: formData.gallery_images,
                    live_url: formData.live_url || null,
                    github_url: formData.github_url || null,
                    status: formData.status,
                    order_index: newOrderIndex,
                });

                if (error) throw error;
            }

            router.push('/admin/portfolios');
            router.refresh();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to save portfolio';
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
                    <Link href="/admin/portfolios">
                        <Button variant="ghost" size="sm" type="button">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            {isEdit ? 'Edit Portfolio' : 'New Portfolio'}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {isEdit ? 'Update your portfolio project' : 'Create a new portfolio project'}
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
                            placeholder="My Awesome Project"
                            required
                        />

                        <Input
                            label="Slug"
                            value={formData.slug}
                            onChange={(e) => handleInputChange('slug', e.target.value)}
                            placeholder="my-awesome-project"
                            hint="URL-friendly identifier for this project"
                            required
                        />

                        <Textarea
                            label="Description (Markdown)"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Describe your project in detail..."
                            className="min-h-[200px] font-mono text-sm"
                            hint="Supports Markdown formatting"
                        />
                    </Card>

                    <Card className="p-6 space-y-4">
                        <h3 className="font-semibold">Tech Stack</h3>
                        <div className="flex gap-2">
                            <Input
                                value={newTech}
                                onChange={(e) => setNewTech(e.target.value)}
                                placeholder="Add technology..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTech();
                                    }
                                }}
                            />
                            <Button type="button" onClick={handleAddTech} variant="secondary">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tech_stack.map((tech) => (
                                <Badge key={tech} variant="primary" className="flex items-center gap-1">
                                    {tech}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTech(tech)}
                                        className="hover:text-error"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6 space-y-4">
                        <h3 className="font-semibold">Links</h3>
                        <Input
                            label="Live URL"
                            type="url"
                            value={formData.live_url}
                            onChange={(e) => handleInputChange('live_url', e.target.value)}
                            placeholder="https://example.com"
                        />
                        <Input
                            label="GitHub URL"
                            type="url"
                            value={formData.github_url}
                            onChange={(e) => handleInputChange('github_url', e.target.value)}
                            placeholder="https://github.com/username/repo"
                        />
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="p-6 space-y-4">
                        <h3 className="font-semibold">Featured Image</h3>
                        {formData.featured_image ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-surface-hover">
                                <Image
                                    src={formData.featured_image}
                                    alt="Featured"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(formData.featured_image!, false)}
                                    className="absolute top-2 right-2 p-1.5 bg-error rounded-full text-white hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                                <Upload className="w-8 h-8 text-muted mb-2" />
                                <span className="text-sm text-muted-foreground">
                                    {uploading ? 'Uploading...' : 'Click to upload'}
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, false)}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </label>
                        )}
                    </Card>

                    <Card className="p-6 space-y-4">
                        <h3 className="font-semibold">Gallery Images</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {formData.gallery_images.map((url, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-surface-hover">
                                    <Image src={url} alt={`Gallery ${index + 1}`} fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(url, true)}
                                        className="absolute top-1 right-1 p-1 bg-error rounded-full text-white hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                                <Plus className="w-6 h-6 text-muted" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleImageUpload(e, true)}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    </Card>
                </div>
            </div>
        </form>
    );
}
