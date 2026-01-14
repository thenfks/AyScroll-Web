import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from './button';

interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {
    gradient?: 'brand' | 'dark';
    glow?: boolean;
    round?: boolean;
}

export const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
    ({ className, gradient = 'brand', glow = true, round = false, children, ...props }, ref) => {
        const gradientStyles = {
            'brand': 'bg-brand-gradient text-white border-transparent',
            'dark': 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
        };

        const glowStyles = {
            'brand': 'shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30',
            'dark': 'shadow-none',
        };

        return (
            <Button
                ref={ref}
                className={cn(
                    'transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-black uppercase tracking-widest',
                    gradientStyles[gradient],
                    glow && glowStyles[gradient],
                    round ? 'rounded-full' : 'rounded-xl',
                    className
                )}
                {...props}
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {children}
                </span>
            </Button>
        );
    }
);

GradientButton.displayName = 'GradientButton';
