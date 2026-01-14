import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { RightSidebar } from './RightSidebar';
import { MobileHeader } from './MobileHeader';
import { MobileNavDrawer } from './MobileNavDrawer';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
  showRightSidebar?: boolean;
  fullScreenMobile?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showRightSidebar = true,
  fullScreenMobile = false
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile Header */}
      {isMobile && !fullScreenMobile && (
        <MobileHeader onMenuClick={() => setMobileNavOpen(true)} />
      )}

      {/* Mobile Nav Drawer */}
      <MobileNavDrawer open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      {/* Main Content */}
      <main
        className={`
          min-h-screen
          ${isMobile
            ? fullScreenMobile
              ? 'pt-0'
              : 'pt-24 px-4 pb-8'
            : `pt-20 pl-[240px] ${showRightSidebar ? 'pr-[320px]' : ''}`
          }
        `}
      >
        <div className={isMobile ? '' : 'p-6'}>
          {children}
        </div>
      </main>

      {/* Right Sidebar - Hidden on mobile */}
      {showRightSidebar && !isMobile && <RightSidebar />}
    </div>
  );
};
