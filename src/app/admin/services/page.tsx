'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Service } from '@/lib/types';
import { Button, Card, Badge, Toggle, Loading } from '@/components/ui';
import {
    Plus,
    Pencil,
    Trash2,
    GripVertical,
    Eye,
    EyeOff,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
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

type IconComponent = React.ComponentType<{ className?: string }>;

function getIconComponent(iconName: string | null): IconComponent | null {
    if (!iconName) return null;
    const icons = LucideIcons as unknown as Record<string, IconComponent>;
    return icons[iconName] || null;
}

function SortableServiceItem({
    service,
    onToggleStatus,
    onDelete,
}: {
    service: Service;
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
    } = useSortable({ id: service.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const IconComponent = getIconComponent(service.icon);

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

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {IconComponent ? (
                            <IconComponent className="w-6 h-6 text-primary" />
                        ) : (
                            <Eye className="w-6 h-6 text-muted" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{service.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                            {service.short_description || 'No description'}
                        </p>
                    </div>

                    {/* Status */}
                    <Badge variant={service.status === 'published' ? 'success' : 'warning'}>
                        {service.status === 'published' ? (
                            <><Eye className="w-3 h-3 mr-1" /> Published</>
                        ) : (
                            <><EyeOff className="w-3 h-3 mr-1" /> Draft</>
                        )}
                    </Badge>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Toggle
                            checked={service.status === 'published'}
                            onChange={(checked) =>
                                onToggleStatus(service.id, checked ? 'published' : 'draft')
                            }
                        />
                        <Link href={`/admin/services/${service.id}`}>
                            <Button variant="ghost" size="sm">
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(service.id)}
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

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchServices();
    }, []);

    async function fetchServices() {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching services:', error);
        } else {
            setServices(data || []);
        }
        setLoading(false);
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = services.findIndex((s) => s.id === active.id);
            const newIndex = services.findIndex((s) => s.id === over.id);

            const newServices = arrayMove(services, oldIndex, newIndex);
            setServices(newServices);

            // Update order in database
            setSaving(true);
            const supabase = createClient();
            const updates = newServices.map((s, index) => ({
                id: s.id,
                order_index: index,
            }));

            for (const update of updates) {
                await supabase
                    .from('services')
                    .update({ order_index: update.order_index })
                    .eq('id', update.id);
            }
            setSaving(false);
        }
    }

    async function handleToggleStatus(id: string, status: 'draft' | 'published') {
        const supabase = createClient();
        const { error } = await supabase
            .from('services')
            .update({ status })
            .eq('id', id);

        if (!error) {
            setServices((prev) =>
                prev.map((s) => (s.id === id ? { ...s, status } : s))
            );
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this service?')) return;

        const supabase = createClient();
        const { error } = await supabase.from('services').delete().eq('id', id);

        if (!error) {
            setServices((prev) => prev.filter((s) => s.id !== id));
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading text="Loading services..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Services</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your services. Drag to reorder.
                    </p>
                </div>
                <Link href="/admin/services/new">
                    <Button>
                        <Plus className="w-4 h-4" />
                        Add Service
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

            {/* Services List */}
            {services.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">No services yet</p>
                    <Link href="/admin/services/new">
                        <Button>
                            <Plus className="w-4 h-4" />
                            Create your first service
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
                        items={services.map((s) => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {services.map((service) => (
                                <SortableServiceItem
                                    key={service.id}
                                    service={service}
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
