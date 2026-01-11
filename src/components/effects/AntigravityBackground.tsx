import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    offset: number;
}

export const AntigravityBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -2000, y: -2000 });
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles: Particle[] = [];
        // Slightly wider gap for a cleaner, more minimalist look
        const gap = 26;
        const mouseRadius = 200;
        // High friction for that "heavy fluid" or "syrup" feel
        const friction = 0.85;
        // Controlled return to base
        const ease = 0.08;

        const initParticles = () => {
            particles.length = 0;
            for (let y = 0; y < height + gap; y += gap) {
                for (let x = 0; x < width + gap; x += gap) {
                    particles.push({
                        x: x,
                        y: y,
                        baseX: x,
                        baseY: y,
                        vx: 0,
                        vy: 0,
                        size: 1.0,
                        opacity: 0.15 + Math.random() * 0.25,
                        offset: Math.random() * Math.PI * 2
                    });
                }
            }
        };

        initParticles();

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        let frame: number;

        const animate = () => {
            timeRef.current += 0.015;
            const time = timeRef.current;

            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, width, height);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Distance from mouse
                const dx = mx - p.x;
                const dy = my - p.y;
                const distSq = dx * dx + dy * dy;
                const dist = Math.sqrt(distSq);

                // 1. Spring-back logic (Always pulling home)
                const dxBase = p.baseX - p.x;
                const dyBase = p.baseY - p.y;
                p.vx += dxBase * ease;
                p.vy += dyBase * ease;

                // 2. Interaction logic (Subtle attraction + Giggle)
                if (dist < mouseRadius) {
                    const force = (mouseRadius - dist) / mouseRadius;

                    // Soft attraction: move slightly TOWARDS the mouse
                    // Using a very small multiplier to keep it "subtle"
                    p.vx += dx * force * 0.035;
                    p.vy += dy * force * 0.035;

                    // The "Giggle": High-frequency shiver when mouse is near
                    // We apply this directly to the position calculation or velocity
                    const shiverStrength = force * 0.8;
                    p.vx += Math.sin(time * 25 + p.offset) * shiverStrength;
                    p.vy += Math.cos(time * 25 + p.offset) * shiverStrength;
                }

                // 3. Constant Idle Drifting (Barely noticeable)
                p.vx += Math.sin(time * 2 + p.offset) * 0.005;
                p.vy += Math.cos(time * 2 + p.offset) * 0.005;

                // Apply physics
                p.vx *= friction;
                p.vy *= friction;
                p.x += p.vx;
                p.y += p.vy;

                // Render dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.fill();
            }

            frame = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ imageRendering: 'auto' }}
        />
    );
};
