import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, hint, id, ...props }, ref) => {
        const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-foreground mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={cn(
                        'w-full px-4 py-2.5 bg-surface border border-border rounded-lg',
                        'text-foreground placeholder:text-muted',
                        'transition-all duration-200 resize-y min-h-[100px]',
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

Textarea.displayName = 'Textarea';

export { Textarea };
