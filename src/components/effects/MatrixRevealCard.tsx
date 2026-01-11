import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const MatrixRevealCard = ({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/10 bg-black/40 transition-colors hover:border-pink-500/50 group",
                className
            )}
        >
            {isHovered && <MatrixRain />}
            <div className="relative z-20">{children}</div>
        </div>
    );
};

export const MatrixRain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        const chars = "XYZ01010101";
        const fontSize = 14;

        // Set canvas size
        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };
        resize();
        window.addEventListener('resize', resize);

        // Grid configuration
        const columns = Math.ceil(canvas.width / fontSize);
        const drops: number[] = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100; // Staggered start
        }

        const draw = () => {
            // Semi-transparent black to create fade trail
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#ec4899"; // Pink matrix text
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                // Randomly brighten some characters
                if (Math.random() > 0.98) {
                    ctx.fillStyle = "#fff";
                } else {
                    ctx.fillStyle = "#ec4899";
                }

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 size-full opacity-30 pointer-events-none"
        />
    );
};
