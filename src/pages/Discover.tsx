import { MainLayout } from '@/components/layout/MainLayout';
import { Search, TrendingUp, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const categories = [
  { name: 'Trending', icon: TrendingUp, color: 'bg-primary' },
  { name: 'Music', icon: Sparkles, color: 'bg-topic-purple' },
  { name: 'Tech', icon: Sparkles, color: 'bg-topic-blue' },
  { name: 'Science', icon: Sparkles, color: 'bg-topic-green' },
  { name: 'History', icon: Sparkles, color: 'bg-topic-orange' },
];

const Discover = () => {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6 animate-fade-in">
          Discover
        </h1>

        {/* Search */}
        <div className="relative mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search topics, creators, or content..."
            className="pl-12 h-14 bg-card border-0 rounded-2xl text-lg"
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                className="flex items-center gap-4 p-5 bg-card rounded-2xl hover:bg-card/80 transition-all duration-200 hover:scale-[1.02] group"
              >
                <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-foreground" />
                </div>
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured */}
        <div className="mt-10 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <h2 className="text-xl font-semibold text-foreground mb-4">Featured Creators</h2>
          <div className="bg-card rounded-2xl p-6">
            <p className="text-muted-foreground text-center py-8">
              Browse as a guest or sign in to see personalized recommendations!
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Discover;
