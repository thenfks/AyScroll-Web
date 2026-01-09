import { MainLayout } from '@/components/layout/MainLayout';
import { VideoCard } from '@/components/feed/VideoCard';
import { MOCK_REELS } from '@/data/data';

const Index = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center gap-8">
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
