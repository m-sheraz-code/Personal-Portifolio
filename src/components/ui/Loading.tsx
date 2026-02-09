import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    className?: string;
}

export function Loading({ size = 'md', text, className }: LoadingProps) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
            <Loader2 className={cn('animate-spin text-primary', sizes[size])} />
            {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
    );
}

export function LoadingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loading size="lg" text="Loading..." />
        </div>
    );
}

export function LoadingOverlay({ isLoading }: { isLoading: boolean }) {
    if (!isLoading) return null;

    return (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Loading size="md" />
        </div>
    );
}
