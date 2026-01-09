import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Clock, Play, FolderOpen } from 'lucide-react';

const Library = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6 animate-fade-in">
            Your Library
          </h1>

          {/* Quick Access */}
          <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <button className="flex flex-col items-center gap-3 p-6 bg-card rounded-2xl hover:bg-card/80 transition-all hover:scale-[1.02]">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <span className="font-medium text-foreground">Watch Later</span>
              <span className="text-sm text-muted-foreground">0 videos</span>
            </button>

            <button className="flex flex-col items-center gap-3 p-6 bg-card rounded-2xl hover:bg-card/80 transition-all hover:scale-[1.02]">
              <div className="w-14 h-14 bg-topic-green/20 rounded-2xl flex items-center justify-center">
                <Play className="w-7 h-7 text-topic-green" />
              </div>
              <span className="font-medium text-foreground">History</span>
              <span className="text-sm text-muted-foreground">0 videos</span>
            </button>

            <button className="flex flex-col items-center gap-3 p-6 bg-card rounded-2xl hover:bg-card/80 transition-all hover:scale-[1.02]">
              <div className="w-14 h-14 bg-topic-purple/20 rounded-2xl flex items-center justify-center">
                <FolderOpen className="w-7 h-7 text-topic-purple" />
              </div>
              <span className="font-medium text-foreground">Playlists</span>
              <span className="text-sm text-muted-foreground">0 playlists</span>
            </button>
          </div>

          {/* Recent Activity */}
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
            <div className="bg-card rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Play className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No activity yet</h3>
              <p className="text-muted-foreground">
                Start exploring content to build your library!
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Library;
