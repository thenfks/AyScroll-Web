import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const ParallaxFeatureSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section ref={containerRef} className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-black overflow-hidden flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[80vh]">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/20 to-black z-0" />

      <motion.div style={{ y }} className="relative z-10 w-full max-w-5xl">
        <img src="/images/ayscroll-app-desktop-experience.png" alt="AyScroll Desktop Experience - Micro Learning Platform" className="w-full h-auto drop-shadow-2xl" />
      </motion.div>

      <div className="relative z-20 text-center mt-[-8%] sm:mt-[-5%]">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-white drop-shadow-lg">
          AyScroll <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Features</span>
        </h2>
      </div>
    </section>
  );
};
