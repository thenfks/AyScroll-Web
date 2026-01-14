import React from 'react';
import { User, ShieldCheck, CreditCard, Bell, LogOut, ChevronRight } from 'lucide-react';

interface AccountNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  logout: () => void;
}

const AccountNavigation: React.FC<AccountNavigationProps> = ({ activeTab, setActiveTab, logout }) => {
  const accountItems = [
    { name: 'Personal Info', icon: User },
    { name: 'Login & Security', icon: ShieldCheck },
    { name: 'Notifications', icon: Bell },
  ];

  return (
    <section className="p-6 rounded-[40px] bg-secondary/30 border border-border shadow-theme-lg">
      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/30 mb-6 px-2">Account</h3>
      <div className="space-y-2">
        {accountItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`w-full flex items-center justify-between px-6 py-3 rounded-2xl transition-all group ${activeTab === item.name ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
          >
            <div className="flex items-center gap-4">
              {(() => {
                const Icon = item.icon;
                return <Icon className="w-5 h-5" />;
              })()}
              <span className="text-[14px] font-bold">{item.name}</span>
            </div>
            <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === item.name ? 'opacity-100' : ''}`} />
          </button>
        ))}
        <div className="h-px bg-border my-6 mx-2"></div>
        <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 text-muted-foreground/40 hover:text-destructive transition-all rounded-2xl group">
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[14px] font-bold">Sign Out</span>
        </button>
      </div>
    </section>
  );
};

export default AccountNavigation;
