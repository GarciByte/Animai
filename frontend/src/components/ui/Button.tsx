import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'subtle' | 'confirm';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary: 'bg-accent text-white hover:bg-accent-hover',
    secondary: 'bg-card text-foreground hover:bg-card-hover border border-border',
    ghost: 'bg-transparent text-muted hover:bg-card hover:text-foreground',
    outline: 'bg-transparent text-foreground border border-border hover:bg-card',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    subtle: 'bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25',
    confirm: 'bg-emerald-600 text-white hover:bg-emerald-700',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { variant = 'primary', size = 'md', isLoading = false, disabled, className = '', children, ...props },
        ref,
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`inline-flex items-center justify-center rounded-full font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
                {...props}
            >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    },
);

Button.displayName = 'Button';
