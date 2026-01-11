import { SEOHead } from "@/components/seo/SEOHead";
import { ScrollMarker } from "@/components/ui/ScrollMarker";
import { DownloadSection } from "@/components/sections/DownloadSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { ParallaxFeatureSection } from "@/components/landing/ParallaxFeatureSection";
import { StickyFeaturesSection } from "@/components/landing/StickyFeaturesSection";
import { DevicesParallaxSection } from "@/components/landing/DevicesParallaxSection";
import { CategoryGlobeSection } from "@/components/landing/CategoryGlobeSection";
import { Footer } from "@/components/landing/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-pink-500 selection:text-white font-sans">
      <SEOHead />
      <ScrollMarker sections={6} />

      <HeroSection />
      <ParallaxFeatureSection />
      <StickyFeaturesSection />
      <DevicesParallaxSection />
      <DownloadSection />
      <CategoryGlobeSection />
      <Footer />
    </div>
  );
}
