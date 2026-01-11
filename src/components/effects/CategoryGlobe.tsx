import React, { useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useMotionValue } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CategoryGlobeProps {
    icons: { Icon: LucideIcon; label: string; color: string }[];
    radius?: number;
}

export default function CategoryGlobe({ icons, radius = 300 }: CategoryGlobeProps) {

    // Constants for 3D projection
    const perspective = 1000;

    // Fibonacci Sphere Algorithm to distribute points
    const points = useMemo(() => {
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

        return icons.map((item, i) => {
            const y = 1 - (i / (icons.length - 1)) * 2; // y goes from 1 to -1
            const radiusAtY = Math.sqrt(1 - y * y); // Radius at y

            const theta = phi * i; // Golden angle increment

            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;

            return { ...item, x: x * radius, y: y * radius, z: z * radius };
        });
    }, [icons, radius]);

    const containerRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    // Evervault Mask Logic
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);


    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const rotateY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 4]);
    const rotateX = useTransform(scrollYProgress, [0, 1], [0, Math.PI / 4]);

    useMotionValueEvent(rotateY, "change", (latest) => {
        setRotation(prev => ({ ...prev, y: latest }));
    });

    useMotionValueEvent(rotateX, "change", (latest) => {
        setRotation(prev => ({ ...prev, x: latest }));
    });

    return (
        <div
            ref={containerRef}
            className="relative flex items-center justify-center w-full h-[800px] overflow-hidden perspective-container group/card"
            style={{ perspective: `${perspective}px` }}
        >


            <div className="relative transform-style-3d w-full h-full flex items-center justify-center">
                {points.map((point, index) => {
                    // Apply rotation matrix
                    // Rotate around Y axis
                    const cosY = Math.cos(rotation.y);
                    const sinY = Math.sin(rotation.y);

                    // Rotate around X axis
                    const cosX = Math.cos(rotation.x);
                    const sinX = Math.sin(rotation.x);

                    // 1. Rotate Y
                    let x1 = point.x * cosY - point.z * sinY;
                    let z1 = point.z * cosY + point.x * sinY;

                    // 2. Rotate X
                    let y1 = point.y * cosX - z1 * sinX;
                    let z2 = z1 * cosX + point.y * sinX;

                    // Calculate scale and opacity based on Z depth
                    // z2 ranges roughly from -radius to +radius
                    // We want items in front (positive z or closer to camera) to be larger/clearer
                    // Standard perspective projection: scale = perspective / (perspective + z)
                    // But here z is world space. Let's assume camera is at z = -perspective? 
                    // Let's use simple depth mapping

                    const scale = (z2 + radius * 2) / (radius * 2.5); // Normalize roughly 0.4 to 1.2
                    const opacity = Math.max(0.2, (z2 + radius) / (radius * 2)); // Normalize 0 to 1

                    return (
                        <motion.div
                            key={index}
                            className="absolute flex flex-col items-center justify-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-black/40 transition-colors hover:bg-white/10 hover:scale-110 cursor-pointer group"
                            style={{
                                transform: `translate3d(${x1}px, ${y1}px, ${z2}px) scale(${Math.max(0.5, Math.min(1.2, scale))})`,
                                zIndex: Math.floor(z2 + radius),
                                opacity: Math.max(0.3, Math.min(1, opacity)),
                            }}
                        >
                            <point.Icon
                                className="w-8 h-8 transition-colors group-hover:text-pink-500"
                                style={{ color: point.color }}
                            />
                            <span className="text-sm font-medium text-white/80 whitespace-nowrap group-hover:text-white">
                                {point.label}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
