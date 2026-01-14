import React from 'react';
import { User, ShieldCheck, Moon, Download, LogOut, Bell, ChevronRight } from 'lucide-react';
import Toggle from './Toggle';
import { cn } from '@/lib/utils';

interface MinimalistMobileAccountProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    darkMode: boolean;
    setDarkMode: (enabled: boolean) => void;
    autoDownload: boolean;
    setAutoDownload: (enabled: boolean) => void;
    logout: () => void;
}

const MinimalistMobileAccount: React.FC<MinimalistMobileAccountProps> = ({
    activeTab,
    setActiveTab,
    darkMode,
    setDarkMode,
    autoDownload,
    setAutoDownload,
    logout
}) => {
    const accountItems = [
        { name: 'Personal Info', icon: User, color: 'text-pink-500' },
        { name: 'Login & Security', icon: ShieldCheck, color: 'text-purple-500' },
        { name: 'Notifications', icon: Bell, color: 'text-orange-500' },
    ];

    return (
        <div className="space-y-3">
            {/* Quick Settings Bar */}
            <div className="flex gap-2">
                <div className="flex-1 flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <Moon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-bold text-white/60">Dark</span>
                    </div>
                    <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
                </div>
                <div className="flex-1 flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                            <Download className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-bold text-white/60">Auto</span>
                    </div>
                    <Toggle enabled={autoDownload} onChange={() => setAutoDownload(!autoDownload)} />
                </div>
            </div>

            {/* Account List */}
            <div className="rounded-[24px] bg-white/[0.03] border border-white/5 divide-y divide-white/5">
                {accountItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.name;
                    return (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className="w-full flex items-center justify-between p-3 hover:bg-white/[0.02] transition-colors first:rounded-t-[24px]"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-white/5", isActive ? item.color : "text-white/20")}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <span className={cn("text-xs font-bold", isActive ? "text-white" : "text-white/40 text-left")}>{item.name}</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-white/10" />
                        </button>
                    );
                })}
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-between p-3 hover:bg-white/[0.02] transition-colors rounded-b-[24px]"
                >
                    <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/10 text-red-500">
                            <LogOut className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-white/40">Sign Out</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-white/10" />
                </button>
            </div>
        </div>
    );
};

export default MinimalistMobileAccount;
