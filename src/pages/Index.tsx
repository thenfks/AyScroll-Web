import { MainLayout } from '@/components/layout/MainLayout';
import { VideoCard } from '@/components/feed/VideoCard';
import { MOCK_REELS } from '@/data/data';

const Index = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center gap-8">
        <div className="text-center mb-4 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to AyScroll
          </h1>
          <p className="text-muted-foreground">
            Discover amazing content from creators worldwide
          </p>
        </div>
        
        {/* Vertical scrolling feed */}
        <div className="space-y-8 pb-8">
          {MOCK_REELS.map((reel) => (
            <VideoCard
              key={reel.id}
              {...reel}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
