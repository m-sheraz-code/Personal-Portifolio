import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-foreground mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        'w-full px-4 py-2.5 bg-surface border border-border rounded-lg',
                        'text-foreground placeholder:text-muted',
                        'transition-all duration-200',
                        'focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none',
                        error && 'border-error focus:border-error focus:ring-error/20',
                        className
                    )}
                    {...props}
                />
                {hint && !error && (
                    <p className="mt-1.5 text-sm text-muted">{hint}</p>
                )}
                {error && (
                    <p className="mt-1.5 text-sm text-error">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
