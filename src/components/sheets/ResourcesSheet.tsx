import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { X, FileText, Link2, Quote, Sparkles } from 'lucide-react';
import { Resource } from '@/data/types';

interface ResourcesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resources?: Resource[];
  title?: string;
}

const resourceIcons = {
  pdf: FileText,
  link: Link2,
  citation: Quote,
};

export const ResourcesSheet: React.FC<ResourcesSheetProps> = ({
  open,
  onOpenChange,
  resources = [],
  title = 'Reference Materials'
}) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-[#0A0A0F]/95 backdrop-blur-xl border-t border-white/10 max-h-[85vh]">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="relative border-b border-white/5 pb-4">
            <button 
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
            <DrawerTitle className="text-xl font-black text-white tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              {title}
            </DrawerTitle>
          </DrawerHeader>
          
          <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
            {resources.length > 0 ? (
              <>
                {resources.map((resource, index) => {
                  const Icon = resourceIcons[resource.type] || FileText;
                  return (
                    <a 
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-pink-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">
                            {resource.type}
                          </p>
                          <p className="text-pink-400 font-semibold group-hover:text-pink-300 transition-colors truncate">
                            {resource.title}
                          </p>
                          {resource.description && (
                            <p className="text-white/50 text-sm mt-1 line-clamp-2">
                              {resource.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </a>
                  );
                })}
                
                {/* Smart Analyser Upsell */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 mt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold">Smart Analyser</p>
                      <p className="text-white/50 text-xs">AI-powered deep analysis</p>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm mb-4">
                    Get comprehensive insights, related topics, and personalized learning paths.
                  </p>
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm hover:opacity-90 transition-opacity">
                    Unlock Pro Features
                  </button>
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-white/40 font-medium">No resources available</p>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
