import { cn } from '@/lib/utils';

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    className?: string;
}

export function Toggle({ checked, onChange, label, disabled = false, className }: ToggleProps) {
    return (
        <label className={cn('inline-flex items-center gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed', className)}>
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => !disabled && onChange(e.target.checked)}
                    className="sr-only peer"
                    disabled={disabled}
                />
                <div className={cn(
                    'w-11 h-6 rounded-full transition-colors duration-200',
                    'peer-focus:ring-2 peer-focus:ring-primary/20',
                    checked ? 'bg-primary' : 'bg-surface-active'
                )}>
                    <div className={cn(
                        'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200',
                        checked && 'translate-x-5'
                    )} />
                </div>
            </div>
            {label && (
                <span className="text-sm text-foreground">{label}</span>
            )}
        </label>
    );
}
