import { MainLayout } from '@/components/layout/MainLayout';
import { VideoCard } from '@/components/feed/VideoCard';

const mockVideos = [
  {
    id: '1',
    category: 'MUSIC',
    duration: '4m',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=700&fit=crop',
    author: {
      name: 'Mayank Jha',
      username: '@mayankjha',
    },
    title: 'Mastering Aahatein from 3 A.M Riffs',
    description: 'Breaking down the hybrid picking and double stops used by Mayank.',
    likes: '42.5k',
  },
  {
    id: '2',
    category: 'TECH',
    duration: '8m',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=700&fit=crop',
    author: {
      name: 'Anurag Pandey',
      username: '@anurag',
    },
    title: 'AI Revolution: What Comes Next?',
    description: 'Exploring the cutting edge of artificial intelligence and machine learning.',
    likes: '128k',
  },
  {
    id: '3',
    category: 'SCIENCE',
    duration: '6m',
    thumbnail: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&h=700&fit=crop',
    author: {
      name: 'Dr. Sarah Chen',
      username: '@sarahchen',
    },
    title: 'Quantum Computing Explained Simply',
    description: 'Understanding qubits and superposition in under 6 minutes.',
    likes: '89.2k',
  },
];

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
          {mockVideos.map((video) => (
            <VideoCard
              key={video.id}
              {...video}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
