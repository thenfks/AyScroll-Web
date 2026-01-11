'use client';

import * as React from 'react';
import {
    motion,
    useInView,
    type UseInViewOptions,
    type Transition,
} from 'motion/react';

import { cn } from '@/lib/utils';

const ENTRY_ANIMATION = {
    initial: { rotateX: 0 },
    animate: { rotateX: 90 },
};

const EXIT_ANIMATION = {
    initial: { rotateX: 90 },
    animate: { rotateX: 0 },
};

const formatCharacter = (char: string) => (char === ' ' ? '\u00A0' : char);

type RollingTextProps = Omit<React.ComponentProps<'span'>, 'children'> & {
    transition?: Transition;
    inView?: boolean;
    inViewMargin?: UseInViewOptions['margin'];
    inViewOnce?: boolean;
    text: string;
};

const RollingText = React.forwardRef<HTMLSpanElement, RollingTextProps>(
    (
        {
            transition = { duration: 0.5, delay: 0.1, ease: 'easeOut' },
            inView = false,
            inViewMargin = '0px',
            inViewOnce = true,
            text,
            className,
            ...props
        },
        ref
    ) => {
        const localRef = React.useRef<HTMLSpanElement>(null);
        React.useImperativeHandle(ref, () => localRef.current!);

        const inViewResult = useInView(localRef, {
            once: inViewOnce,
            margin: inViewMargin,
        });
        const isInView = !inView || inViewResult;

        const characters = React.useMemo(() => text.split(''), [text]);

        return (
            <span
                data-slot="rolling-text"
                className={cn('relative inline-block', className)}
                {...props}
                ref={localRef}
            >
                {characters.map((char, idx) => (
                    <span
                        key={idx}
                        className="relative inline-block perspective-[9999999px] transform-3d w-auto"
                        aria-hidden="true"
                    >
                        <motion.span
                            className={cn("absolute inline-block backface-hidden origin-[50%_25%]", className)}
                            initial={ENTRY_ANIMATION.initial}
                            animate={isInView ? ENTRY_ANIMATION.animate : undefined}
                            transition={{
                                ...transition,
                                delay: idx * (transition?.delay ?? 0),
                            }}
                            style={{
                                backgroundSize: `${characters.length * 100}% 100%`,
                                backgroundPosition: `${(idx / (characters.length - 1)) * 100}% center`,
                            }}
                        >
                            {formatCharacter(char)}
                        </motion.span>
                        <motion.span
                            className={cn("absolute inline-block backface-hidden origin-[50%_100%]", className)}
                            initial={EXIT_ANIMATION.initial}
                            animate={isInView ? EXIT_ANIMATION.animate : undefined}
                            transition={{
                                ...transition,
                                delay: idx * (transition?.delay ?? 0) + 0.3,
                            }}
                            style={{
                                backgroundSize: `${characters.length * 100}% 100%`,
                                backgroundPosition: `${(idx / (characters.length - 1)) * 100}% center`,
                            }}
                        >
                            {formatCharacter(char)}
                        </motion.span>
                        <span className="invisible">{formatCharacter(char)}</span>
                    </span>
                ))}

                <span className="sr-only">{text}</span>
            </span>
        );
    }
);

RollingText.displayName = 'RollingText';

export { RollingText, type RollingTextProps };
