import React from 'react';
import { Moon, Download } from 'lucide-react';
import Toggle from './Toggle';

interface PreferencesSectionProps {
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  autoDownload: boolean;
  setAutoDownload: (enabled: boolean) => void;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({ darkMode, setDarkMode, autoDownload, setAutoDownload }) => {
  return (
    <section className="p-6 rounded-[40px] bg-secondary/30 border border-border shadow-theme-lg">
      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/30 mb-6 px-2">Preferences</h3>
      <div className="space-y-4 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-foreground/80">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Moon className="w-5 h-5" />
            </div>
            <span className="text-[14px] font-bold">Dark Mode</span>
          </div>
          <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-foreground/80">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Download className="w-5 h-5" />
            </div>
            <span className="text-[14px] font-bold">Auto-Download</span>
          </div>
          <Toggle enabled={autoDownload} onChange={() => setAutoDownload(!autoDownload)} />
        </div>
      </div>
    </section>
  );
};

export default PreferencesSection;
