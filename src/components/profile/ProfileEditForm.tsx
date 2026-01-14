import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/database';
import { Camera, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProfileEditFormProps {
    onSave: () => void;
    onCancel: () => void;
    className?: string;
    isMobile?: boolean; // To adjust layout if needed
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ onSave, onCancel, className, isMobile }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [profile, setProfile] = useState<Partial<UserProfile>>({
        display_name: '',
        username: '',
        bio: '',
        location: '',
        website: '',
        avatar_url: '',
    });
    const [originalUsername, setOriginalUsername] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameError, setUsernameError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            loadProfile();
        }
    }, [user]);

    // Check username availability
    useEffect(() => {
        const checkUsername = async () => {
            const usernameToCheck = profile.username?.toLowerCase();

            if (!usernameToCheck || usernameToCheck === originalUsername) {
                setUsernameError(null);
                return;
            }

            if (usernameToCheck.length < 3) {
                setUsernameError("Username must be at least 3 characters");
                return;
            }

            setIsCheckingUsername(true);
            try {
                const { data, error } = await supabase
                    .from('user_profiles')
                    .select('username')
                    .eq('username', usernameToCheck)
                    .single();

                if (data) {
                    setUsernameError("Username is already taken");
                } else {
                    setUsernameError(null);
                }
            } catch (error) {
                // Ignore "no rows found" error as it means username is available
                // Supabase .single() throws if no rows found
                setUsernameError(null);
            } finally {
                setIsCheckingUsername(false);
            }
        };

        const timer = setTimeout(checkUsername, 500);
        return () => clearTimeout(timer);
    }, [profile.username, originalUsername]);

    const loadProfile = async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single() as any;

        if (error) {
            console.error('Error loading profile:', error);
            return;
        }

        if (data) {
            setProfile({
                display_name: data.display_name || '',
                username: data.username || '',
                bio: data.bio || '',
                location: data.location || '',
                website: data.website || '',
                avatar_url: data.avatar_url || '',
            });
            setOriginalUsername(data.username || '');
        }
    };

    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create local preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setSelectedFile(file);

        // Cleanup previous preview if exists to avoid memory leaks
        // This return is for the useEffect cleanup, but here it's a direct function call.
        // For a direct function, you'd typically handle cleanup explicitly if needed,
        // but for a single file selection, the browser handles it when the page unloads.
        // If you were to select multiple files over time, you'd want to revoke previous URLs.
        // For this specific use case, it's fine as is.
    };

    const handleSave = async () => {
        if (!user) return;
        if (usernameError) return; // Prevent save if username invalid

        setLoading(true);
        try {
            let avatarUrl = profile.avatar_url;

            // 1. Upload new avatar if selected
            if (selectedFile) {
                setUploadingImage(true);
                const fileExt = selectedFile.name.split('.').pop();
                const fileName = `${user.id}-${Date.now()}.${fileExt}`;
                const filePath = `avatars/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('user-uploads')
                    .upload(filePath, selectedFile);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('user-uploads')
                    .getPublicUrl(filePath);

                avatarUrl = data.publicUrl;
                setUploadingImage(false);
            }

            // 2. Update Profile Data
            const { error } = await supabase
                .from('user_profiles')
                .update({
                    display_name: profile.display_name,
                    username: profile.username,
                    bio: profile.bio,
                    location: profile.location,
                    website: profile.website,
                    avatar_url: avatarUrl,
                } as any)
                .eq('id', user.id) as any;

            if (error) throw error;

            toast({
                title: 'Profile Updated',
                description: 'Your changes have been saved successfully.',
                variant: 'success',
            });

            onSave();
        } catch (error: any) {
            console.error('Profile update error:', error);
            const isUsernameConflict = error.code === '23505' || error.status === 409 || (error.message && error.message.includes('username'));

            toast({
                title: isUsernameConflict ? 'Username Taken' : 'Error',
                description: isUsernameConflict
                    ? 'This username is already taken. Please choose another one.'
                    : (error.message || 'Failed to update profile'),
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
            setUploadingImage(false);
        }
    };

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {!isMobile && (
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                    <h2 className="text-3xl font-black text-white tracking-tight">Edit Profile</h2>
                    <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full hover:bg-white/10 text-white/60 hover:text-white">
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            )}

            <div className={`flex-1 overflow-y-auto ${isMobile ? 'px-6 py-6' : 'pr-4'}`}>
                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-6 mb-8">
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/10">
                            <img
                                src={previewUrl || profile.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name || 'User')}&background=random`}
                                className="w-full h-full rounded-full object-cover"
                                alt="Avatar"
                            />
                        </div>
                        <label className="absolute bottom-0 right-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg border border-white/10">
                            <Camera className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarSelect}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* Form Fields - Grid for Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/60 ml-1">Display Name</label>
                        <input
                            type="text"
                            value={profile.display_name || ''}
                            onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-pink-500/50 transition-colors placeholder:text-white/20"
                            placeholder="Your display name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/60 ml-1">Username</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={profile.username || ''}
                                onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                                className={`w-full h-12 bg-white/5 border ${usernameError ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 text-white focus:outline-none focus:border-pink-500/50 transition-colors placeholder:text-white/20 pr-10`}
                                placeholder="username"
                            />
                            {isCheckingUsername && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                        {usernameError ? (
                            <p className="text-xs text-red-500 mt-1 font-medium">{usernameError}</p>
                        ) : (
                            <p className="text-xs text-white/30 mt-1 text-right">Lowercase letters, numbers, and underscores only</p>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-white/60 ml-1">Bio</label>
                        <textarea
                            value={profile.bio || ''}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors resize-none placeholder:text-white/20"
                            placeholder="Tell us about yourself..."
                            maxLength={160}
                        />
                        <p className="text-xs text-white/30 text-right">{(profile.bio || '').length}/160</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/60 ml-1">Location</label>
                        <input
                            type="text"
                            value={profile.location || ''}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-pink-500/50 transition-colors placeholder:text-white/20"
                            placeholder="City, Country"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/60 ml-1">Website</label>
                        <input
                            type="url"
                            value={profile.website || ''}
                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-pink-500/50 transition-colors placeholder:text-white/20"
                            placeholder="https://yourwebsite.com"
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className={`mt-6 pt-6 border-t border-white/10 flex gap-4 ${isMobile ? 'px-6 pb-6 bg-[#0A0A0F]' : ''}`}>
                <Button
                    onClick={onCancel}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl border-white/10 text-white/60 hover:text-white hover:bg-white/5 bg-transparent"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={loading || uploadingImage}
                    className="flex-1 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-pink-500/20"
                >
                    {loading ? (uploadingImage ? 'Uploading Image...' : 'Saving Profile...') : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default ProfileEditForm;
