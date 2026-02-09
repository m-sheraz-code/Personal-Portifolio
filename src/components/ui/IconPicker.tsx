'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui';
import { Search, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Common icons for services
const COMMON_ICONS = [
    'Code', 'Globe', 'Smartphone', 'Monitor', 'Database', 'Cloud',
    'Palette', 'Layers', 'Zap', 'Shield', 'Lock', 'Settings',
    'BarChart', 'PieChart', 'TrendingUp', 'Target', 'Award', 'Star',
    'Heart', 'MessageSquare', 'Mail', 'Bell', 'Camera', 'Image',
    'Video', 'Music', 'Headphones', 'Mic', 'Wifi', 'Bluetooth',
    'Server', 'HardDrive', 'Cpu', 'Terminal', 'FileCode', 'Braces',
    'GitBranch', 'Github', 'Figma', 'Pen', 'Pencil', 'Brush',
    'Lightbulb', 'Rocket', 'Send', 'Download', 'Upload', 'Share',
    'Users', 'UserPlus', 'Building', 'Home', 'MapPin', 'Navigation',
    'Clock', 'Calendar', 'CheckCircle', 'XCircle', 'AlertTriangle',
    'Search', 'Filter', 'Eye', 'EyeOff', 'Edit', 'Trash',
    'Plus', 'Minus', 'RefreshCw', 'RotateCcw', 'Move', 'Maximize',
    'Link', 'ExternalLink', 'Bookmark', 'Tag', 'Hash', 'AtSign',
];

interface IconPickerProps {
    value: string;
    onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredIcons = useMemo(() => {
        if (!search) return COMMON_ICONS;
        return COMMON_ICONS.filter((icon) =>
            icon.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    type IconComponent = React.ComponentType<{ className?: string }>;
    const icons = LucideIcons as unknown as Record<string, IconComponent>;
    const SelectedIcon = value ? icons[value] : null;

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-foreground mb-1.5">
                Icon
            </label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 bg-surface border border-border rounded-lg',
                    'text-left transition-colors',
                    'hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none'
                )}
            >
                {SelectedIcon ? (
                    <>
                        <div className="p-2 rounded-lg bg-primary/10">
                            <SelectedIcon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="flex-1 text-foreground">{value}</span>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange('');
                            }}
                            className="p-1 text-muted hover:text-foreground"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <span className="text-muted">Select an icon...</span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute z-50 mt-2 w-full p-4 bg-surface border border-border rounded-xl shadow-xl">
                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search icons..."
                                className="pl-10"
                            />
                        </div>

                        <div className="max-h-64 overflow-y-auto">
                            <div className="grid grid-cols-6 gap-2">
                                {filteredIcons.map((iconName) => {
                                    const iconsMap = LucideIcons as unknown as Record<string, IconComponent>;
                                    const IconComponent = iconsMap[iconName];
                                    if (!IconComponent) return null;

                                    return (
                                        <button
                                            key={iconName}
                                            type="button"
                                            onClick={() => {
                                                onChange(iconName);
                                                setIsOpen(false);
                                                setSearch('');
                                            }}
                                            className={cn(
                                                'p-2.5 rounded-lg transition-colors flex items-center justify-center',
                                                value === iconName
                                                    ? 'bg-primary text-white'
                                                    : 'bg-surface-hover hover:bg-primary/10 text-muted hover:text-primary'
                                            )}
                                            title={iconName}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                        </button>
                                    );
                                })}
                            </div>

                            {filteredIcons.length === 0 && (
                                <p className="text-center text-muted-foreground py-4">
                                    No icons found
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
