import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { RightSidebar } from './RightSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  showRightSidebar?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showRightSidebar = true 
}) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main 
        className={`pt-20 pl-[240px] ${showRightSidebar ? 'pr-[320px]' : ''} min-h-screen`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
      {showRightSidebar && <RightSidebar />}
    </div>
  );
};
