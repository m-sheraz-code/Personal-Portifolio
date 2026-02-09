import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    glow?: boolean;
    onClick?: () => void;
}

import { motion } from 'framer-motion';

export function Card({ children, className, hover = false, glow = false, onClick }: CardProps) {
    const Component = motion.div;

    return (
        <Component
            initial={false}
            whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
            whileTap={hover ? { scale: 0.98 } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn(
                'bg-card rounded-xl border border-border p-6',
                'transition-all duration-300',
                hover && 'hover:bg-card-hover hover:border-primary/50 cursor-pointer',
                glow && 'hover:shadow-glow',
                className
            )}
            onClick={onClick}
        >
            {children}
        </Component>
    );
}

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
    return (
        <div className={cn('mb-4', className)}>
            {children}
        </div>
    );
}

interface CardTitleProps {
    children: ReactNode;
    className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
    return (
        <h3 className={cn('text-lg font-semibold text-foreground', className)}>
            {children}
        </h3>
    );
}

interface CardDescriptionProps {
    children: ReactNode;
    className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
    return (
        <p className={cn('text-sm text-muted-foreground mt-1', className)}>
            {children}
        </p>
    );
}

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
    return (
        <div className={cn('', className)}>
            {children}
        </div>
    );
}

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
    return (
        <div className={cn('mt-4 pt-4 border-t border-border', className)}>
            {children}
        </div>
    );
}
