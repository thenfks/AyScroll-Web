import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const DevicesParallaxSection = () => {
  const devicesRef = useRef(null);
  const { scrollYProgress: scrollYProgressDevices } = useScroll({
    target: devicesRef,
    offset: ["start end", "end start"],
  });
  const yIpad = useTransform(scrollYProgressDevices, [0, 1], [100, -100]);
  const yIphone = useTransform(scrollYProgressDevices, [0, 1], [200, -200]);

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-black">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
        <motion.div
          className="order-2 md:order-1 relative flex justify-center h-[400px] sm:h-[500px] md:h-[600px] lg:h-[800px] items-center"
          ref={devicesRef}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* iPad - Back Layer - Slower Parallax */}
            <motion.img
              style={{ y: yIpad }}
              src="/images/ayscroll-app-tablet-view.png"
              alt="AyScroll App on iPad - Tablet Learning"
              className="absolute w-[100%] md:w-[90%] max-w-[900px] z-10 left-[-10%] md:left-[-5%] drop-shadow-2xl"
            />

            {/* iPhone - Front Layer - Faster Parallax */}
            <motion.img
              style={{ y: yIphone }}
              src="/images/ayscroll-app-mobile-view.png"
              alt="AyScroll App on iPhone - Mobile Knowledge"
              className="absolute w-[50%] md:w-[45%] max-w-[450px] z-20 right-[-5%] md:right-[5%] bottom-[-5%] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            />
          </div>
        </motion.div>
        <div className="order-1 md:order-2 space-y-4 sm:space-y-6 text-center md:text-left px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Save</span> your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">knowledge</span> base.
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-zinc-300">
            Save interesting snippets, build your personal library, and access your wisdom offline anywhere.
          </p>
        </div>
      </div>
    </section>
  );
};
