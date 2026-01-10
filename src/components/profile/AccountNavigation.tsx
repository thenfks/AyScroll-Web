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
    { name: 'Subscription', icon: CreditCard },
    { name: 'Notifications', icon: Bell },
  ];

  return (
    <section className="p-6 rounded-[40px] bg-white/[0.02] border border-white/5 shadow-xl">
      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/20 mb-6 px-2">Account</h3>
      <div className="space-y-2">
        {accountItems.map((item) => (
          <button 
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`w-full flex items-center justify-between px-6 py-3 rounded-2xl transition-all group ${activeTab === item.name ? 'bg-pink-500/10 text-pink-500' : 'text-white/40 hover:bg-white/5 hover:text-white/80'}`}
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
        <div className="h-px bg-white/5 my-6 mx-2"></div>
        <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 text-white/20 hover:text-pink-500 transition-all rounded-2xl group">
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[14px] font-bold">Sign Out</span>
        </button>
      </div>
    </section>
  );
};

export default AccountNavigation;
