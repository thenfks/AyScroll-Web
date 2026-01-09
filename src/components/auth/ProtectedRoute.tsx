import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { AuthModal } from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isGuest } = useAuth();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!loading && isGuest) {
      setShowAuthModal(true);
    }
  }, [loading, isGuest]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (isGuest) {
    return (
      <>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
          <div className="text-center max-w-md animate-fade-in">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">
              Sign in to access this page
            </h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to view your {location.pathname.slice(1)} content.
            </p>
          </div>
        </div>
        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </>
    );
  }

  return <>{children}</>;
};
