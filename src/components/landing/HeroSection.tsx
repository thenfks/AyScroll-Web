import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { RollingText } from "@/components/effects/rollingText";
import { useState, useEffect } from "react";

const RotatingTextWrapper = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const words = ["Scrolling", "Watching", "Thinking", "Scrolling"];

  useEffect(() => {
    // Start animation after splash screen completes (3s duration + 0.5s fade out)
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showAnimation ? (
        <RollingText
          text={words[0]}
          className="text-pink-500 ml-3 font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent"
        />
      ) : (
        <span className="text-pink-500 ml-3 font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
          {words[0]}
        </span>
      )}
    </>
  );
};

const heroImages = [
  "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=500&q=80",
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80",
  "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&q=80",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=80",
  "https://images.unsplash.com/photo-1542204165-65926c4f1973?w=500&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&q=80",
  "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=500&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500&q=80",
  "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=500&q=80",
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80",
  "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&q=80",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80",
  "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=500&q=80",
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80",
  "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&q=80",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80",
];

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-4 sm:px-6 overflow-hidden pb-20 sm:pb-0">
      {/* Background - Minimalistic Netflix-style Content Collage */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black select-none pointer-events-none">
        <div className="absolute inset-0 min-w-[150%] -left-[25%] -top-[25%] opacity-80 transform -rotate-6 scale-105">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 animate-scroll-slow">
            {heroImages.map((src, i) => (
              <div key={i} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-zinc-900 border border-white/5">
                <img src={src} className="w-full h-full object-cover opacity-100 hover:scale-105 transition-transform duration-700" alt="" />
              </div>
            ))}
          </div>
        </div>

        {/* Deep Vignette for focus */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.8)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
      </div>

      <div className="relative z-10 max-w-4xl space-y-6 sm:space-y-8 pt-20 sm:pt-24 md:pt-32">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight flex flex-wrap justify-center items-center gap-2">
          Learn by
          <RotatingTextWrapper />
        </h1>
        <p className="text-base sm:text-lg md:text-xl font-normal text-zinc-300 max-w-2xl mx-auto px-4">
          Experience micro-learning that flows with your natural rhythm. <br className="hidden sm:block" /> Bite-sized lessons for curious minds.
        </p>
        <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
          <p className="text-sm sm:text-base text-zinc-400">
            Ready to learn? Enter your email to start your journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch max-w-xl mx-auto px-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full sm:flex-1 h-11 sm:h-12 bg-black/50 border border-white/20 rounded-md px-4 text-white text-sm sm:text-base placeholder:text-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 transition-all backdrop-blur-sm"
            />
            <Link to="/feed" className="w-full sm:w-auto">
              <Button className="w-full h-12 px-8 text-lg font-semibold bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-2xl flex items-center justify-center gap-2 group shadow-lg shadow-pink-500/20 border-0">
                Get Started <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Seamless Fade Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20" />
    </section>
  );
};
