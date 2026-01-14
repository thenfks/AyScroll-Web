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
        { name: 'Personal Info', icon: User, color: 'text-primary' },
        { name: 'Login & Security', icon: ShieldCheck, color: 'text-primary' },
        { name: 'Notifications', icon: Bell, color: 'text-orange-500' },
    ];

    return (
        <div className="space-y-3">
            {/* Quick Settings Bar */}
            <div className="flex gap-2">
                <div className="flex-1 flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Moon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground">Dark</span>
                    </div>
                    <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
                </div>
                <div className="flex-1 flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <Download className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground">Auto</span>
                    </div>
                    <Toggle enabled={autoDownload} onChange={() => setAutoDownload(!autoDownload)} />
                </div>
            </div>

            {/* Account List */}
            <div className="rounded-[24px] bg-secondary/30 border border-border divide-y divide-border">
                {accountItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.name;
                    return (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className="w-full flex items-center justify-between p-3 hover:bg-secondary/50 transition-colors first:rounded-t-[24px]"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-secondary", isActive ? item.color : "text-muted-foreground/40")}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <span className={cn("text-xs font-bold", isActive ? "text-foreground" : "text-muted-foreground text-left")}>{item.name}</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/20" />
                        </button>
                    );
                })}
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-between p-3 hover:bg-secondary/50 transition-colors rounded-b-[24px]"
                >
                    <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-destructive/10 text-destructive">
                            <LogOut className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground">Sign Out</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/20" />
                </button>
            </div>
        </div>
    );
};

export default MinimalistMobileAccount;
