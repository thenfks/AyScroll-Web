import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Bookmark, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Saved = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground">Saved</h1>
            <Button variant="outline" className="rounded-full">
              <FolderPlus className="w-4 h-4 mr-2" />
              New Collection
            </Button>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="aspect-video bg-card rounded-2xl flex flex-col items-center justify-center hover:bg-card/80 transition-all cursor-pointer hover:scale-[1.02]">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-3">
                <Bookmark className="w-7 h-7 text-primary" />
              </div>
              <span className="font-medium text-foreground">All Saved</span>
              <span className="text-sm text-muted-foreground mt-1">0 items</span>
            </div>
          </div>

          {/* Empty State */}
          <div className="bg-card rounded-2xl p-8 text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No saved items</h3>
            <p className="text-muted-foreground mb-4">
              Save videos and content to view them later!
            </p>
            <Button variant="primary" className="rounded-full">
              Explore Content
            </Button>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Saved;
