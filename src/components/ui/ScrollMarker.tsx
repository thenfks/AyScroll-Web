import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScrollMarkerProps {
    sections?: number;
}

export const ScrollMarker: React.FC<ScrollMarkerProps> = ({ sections = 5 }) => {
    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Calculate which section we're in
            const scrollPercentage = scrollPosition / (documentHeight - windowHeight);
            const currentSection = Math.min(
                Math.floor(scrollPercentage * sections),
                sections - 1
            );

            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call

        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    const scrollToSection = (index: number) => {
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollableHeight = documentHeight - windowHeight;
        const targetScroll = (scrollableHeight / sections) * index;

        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    };

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
            {Array.from({ length: sections }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => scrollToSection(index)}
                    className="group relative flex items-center justify-center"
                    aria-label={`Scroll to section ${index + 1}`}
                >
                    {/* Dot */}
                    <motion.div
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSection === index
                            ? 'bg-white scale-150'
                            : 'bg-zinc-600 hover:bg-zinc-400'
                            }`}
                        animate={{
                            scale: activeSection === index ? 1.5 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Tooltip on hover */}
                    <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-white bg-zinc-800 px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                        Section {index + 1}
                    </span>
                </button>
            ))}
        </div>
    );
};
