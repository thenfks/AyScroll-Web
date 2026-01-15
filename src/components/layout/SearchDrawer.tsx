import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Search, User, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const SearchDrawer: React.FC<SearchDrawerProps> = ({ open, onOpenChange }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [activeTab, setActiveTab] = useState<'people' | 'topics'>('people');

    useEffect(() => {
        if (debouncedSearch) {
            performSearch();
        } else {
            setResults([]);
        }
    }, [debouncedSearch, activeTab]);

    const performSearch = async () => {
        setLoading(true);
        try {
            if (activeTab === 'people') {
                const { data, error } = await supabase
                    .from('user_profiles')
                    .select('id, username, display_name, avatar_url, is_verified')
                    .or(`username.ilike.%${debouncedSearch}%,display_name.ilike.%${debouncedSearch}%`)
                    .limit(10);
                if (error) throw error;
                setResults(data || []);
            } else {
                // Search topics (learning_paths)
                const { data, error } = await supabase
                    .from('learning_paths')
                    .select('id, title, description, category, thumbnail_url, creator_id')
                    .or(`title.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%`)
                    .limit(10);
                if (error) throw error;
                setResults(data || []);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = (item: any) => {
        if (activeTab === 'people') {
            navigate(`/profile/${item.username}`);
        } else {
            // Navigate to topic/path page - generic fallback for now
            navigate(`/path/${item.id}`);
        }
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="top" className="h-[100dvh] w-full p-0 border-none bg-background [&>button]:hidden">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-border">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                autoFocus
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 rounded-xl bg-secondary/50 border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                            />
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="p-2 rounded-full hover:bg-secondary text-muted-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>



                    {/* Tab Toggle */}
                    <div className="flex items-center gap-6 px-4 pt-4 pb-2">
                        <button
                            onClick={() => setActiveTab('people')}
                            className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-colors ${activeTab === 'people'
                                ? 'text-foreground border-primary'
                                : 'text-muted-foreground border-transparent hover:text-foreground'
                                }`}
                        >
                            People
                        </button>
                        <button
                            onClick={() => setActiveTab('topics')}
                            className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-colors ${activeTab === 'topics'
                                ? 'text-foreground border-primary'
                                : 'text-muted-foreground border-transparent hover:text-foreground'
                                }`}
                        >
                            Topics
                        </button>
                    </div>

                    {/* Results */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : results.length > 0 ? (
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2 hidden">Results</h3>
                                <div className="space-y-1">
                                    {results.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleItemClick(item)}
                                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-colors text-left"
                                        >
                                            {activeTab === 'people' ? (
                                                <>
                                                    <Avatar className="w-10 h-10 border border-border">
                                                        <AvatarImage src={item.avatar_url} />
                                                        <AvatarFallback>{item.display_name?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-bold text-sm text-foreground">{item.display_name}</span>
                                                            {item.is_verified && (
                                                                <svg className="w-3 h-3 text-blue-500 fill-blue-500/20" viewBox="0 0 24 24">
                                                                    <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">@{item.username}</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                                        <span className="font-bold text-orange-500 text-xs">#</span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-sm text-foreground truncate">{item.title}</h4>
                                                        <p className="text-xs text-muted-foreground truncate">{item.category || 'Learning Path'}</p>
                                                    </div>
                                                </>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : searchTerm ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>No {activeTab} found for "{searchTerm}"</p>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground/50">
                                <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">Search for {activeTab === 'people' ? 'users' : 'learning paths'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
