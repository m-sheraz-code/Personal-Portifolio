'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Portfolio } from '@/lib/types';
import { Button, Card, Badge, Toggle, Loading } from '@/components/ui';
import {
    Plus,
    Pencil,
    Trash2,
    GripVertical,
    ExternalLink,
    Github,
    Eye,
    EyeOff,
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortablePortfolioItem({
    portfolio,
    onToggleStatus,
    onDelete,
}: {
    portfolio: Portfolio;
    onToggleStatus: (id: string, status: 'draft' | 'published') => void;
    onDelete: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: portfolio.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card className="group">
                <div className="flex items-center gap-4 p-4">
                    {/* Drag Handle */}
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-1 text-muted hover:text-foreground"
                    >
                        <GripVertical className="w-5 h-5" />
                    </button>

                    {/* Image */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-hover flex-shrink-0">
                        {portfolio.featured_image ? (
                            <Image
                                src={portfolio.featured_image}
                                alt={portfolio.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted">
                                <Eye className="w-6 h-6" />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{portfolio.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{portfolio.slug}</p>
                        <div className="flex items-center gap-2 mt-1">
                            {portfolio.tech_stack.slice(0, 3).map((tech) => (
                                <Badge key={tech} variant="default" className="text-xs">
                                    {tech}
                                </Badge>
                            ))}
                            {portfolio.tech_stack.length > 3 && (
                                <Badge variant="default" className="text-xs">
                                    +{portfolio.tech_stack.length - 3}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-4">
                        <Badge variant={portfolio.status === 'published' ? 'success' : 'warning'}>
                            {portfolio.status === 'published' ? (
                                <><Eye className="w-3 h-3 mr-1" /> Published</>
                            ) : (
                                <><EyeOff className="w-3 h-3 mr-1" /> Draft</>
                            )}
                        </Badge>
                    </div>

                    {/* Links */}
                    <div className="hidden md:flex items-center gap-2">
                        {portfolio.live_url && (
                            <a
                                href={portfolio.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-muted hover:text-foreground transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                        {portfolio.github_url && (
                            <a
                                href={portfolio.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-muted hover:text-foreground transition-colors"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Toggle
                            checked={portfolio.status === 'published'}
                            onChange={(checked) =>
                                onToggleStatus(portfolio.id, checked ? 'published' : 'draft')
                            }
                        />
                        <Link href={`/admin/portfolios/${portfolio.id}`}>
                            <Button variant="ghost" size="sm">
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(portfolio.id)}
                            className="text-error hover:bg-error/10"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default function PortfoliosPage() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchPortfolios();
    }, []);

    async function fetchPortfolios() {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('portfolios')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching portfolios:', error);
        } else {
            setPortfolios(data || []);
        }
        setLoading(false);
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = portfolios.findIndex((p) => p.id === active.id);
            const newIndex = portfolios.findIndex((p) => p.id === over.id);

            const newPortfolios = arrayMove(portfolios, oldIndex, newIndex);
            setPortfolios(newPortfolios);

            // Update order in database
            setSaving(true);
            const supabase = createClient();
            const updates = newPortfolios.map((p, index) => ({
                id: p.id,
                order_index: index,
            }));

            for (const update of updates) {
                await supabase
                    .from('portfolios')
                    .update({ order_index: update.order_index })
                    .eq('id', update.id);
            }
            setSaving(false);
        }
    }

    async function handleToggleStatus(id: string, status: 'draft' | 'published') {
        const supabase = createClient();
        const { error } = await supabase
            .from('portfolios')
            .update({ status })
            .eq('id', id);

        if (!error) {
            setPortfolios((prev) =>
                prev.map((p) => (p.id === id ? { ...p, status } : p))
            );
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this portfolio?')) return;

        const supabase = createClient();
        const { error } = await supabase.from('portfolios').delete().eq('id', id);

        if (!error) {
            setPortfolios((prev) => prev.filter((p) => p.id !== id));
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading text="Loading portfolios..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Portfolios</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your portfolio projects. Drag to reorder.
                    </p>
                </div>
                <Link href="/admin/portfolios/new">
                    <Button>
                        <Plus className="w-4 h-4" />
                        Add Portfolio
                    </Button>
                </Link>
            </div>

            {/* Saving indicator */}
            {saving && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Saving order...
                </div>
            )}

            {/* Portfolio List */}
            {portfolios.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">No portfolios yet</p>
                    <Link href="/admin/portfolios/new">
                        <Button>
                            <Plus className="w-4 h-4" />
                            Create your first portfolio
                        </Button>
                    </Link>
                </Card>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={portfolios.map((p) => p.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {portfolios.map((portfolio) => (
                                <SortablePortfolioItem
                                    key={portfolio.id}
                                    portfolio={portfolio}
                                    onToggleStatus={handleToggleStatus}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}
