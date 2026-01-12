import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/database';
import { Camera, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, onSave }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<Partial<UserProfile>>({
        display_name: '',
        username: '',
        bio: '',
        location: '',
        website: '',
        avatar_url: '',
    });

    useEffect(() => {
        if (user && isOpen) {
            loadProfile();
        }
    }, [user, isOpen]);

    const loadProfile = async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

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
        }
    };

    const handleSave = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({
                    display_name: profile.display_name,
                    username: profile.username,
                    bio: profile.bio,
                    location: profile.location,
                    website: profile.website,
                    avatar_url: profile.avatar_url,
                })
                .eq('id', user.id);

            if (error) throw error;

            toast({
                title: 'Profile Updated',
                description: 'Your profile has been successfully updated.',
            });

            onSave();
            onClose();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update profile',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('user-uploads')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('user-uploads')
                .getPublicUrl(filePath);

            setProfile({ ...profile, avatar_url: data.publicUrl });

            toast({
                title: 'Avatar Uploaded',
                description: 'Your avatar has been uploaded successfully.',
            });
        } catch (error: any) {
            toast({
                title: 'Upload Failed',
                description: error.message || 'Failed to upload avatar',
                variant: 'destructive',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#0A0A0F] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[#0A0A0F] border-b border-white/10 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-white">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5 text-white/60" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-orange-500">
                                <img
                                    src={profile.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name || 'User')}&background=random`}
                                    className="w-full h-full rounded-full object-cover border-4 border-[#0A0A0F]"
                                    alt="Avatar"
                                />
                            </div>
                            <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                                <Camera className="w-5 h-5 text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-sm text-white/40">Click camera icon to upload new avatar</p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-white/60 mb-2">Display Name</label>
                            <input
                                type="text"
                                value={profile.display_name || ''}
                                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-pink-500/50 transition-colors"
                                placeholder="Your display name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-white/60 mb-2">Username</label>
                            <input
                                type="text"
                                value={profile.username || ''}
                                onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-pink-500/50 transition-colors"
                                placeholder="username"
                            />
                            <p className="text-xs text-white/30 mt-1">Lowercase letters, numbers, and underscores only</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-white/60 mb-2">Bio</label>
                            <textarea
                                value={profile.bio || ''}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors resize-none"
                                placeholder="Tell us about yourself..."
                                maxLength={160}
                            />
                            <p className="text-xs text-white/30 mt-1">{(profile.bio || '').length}/160 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-white/60 mb-2">Location</label>
                            <input
                                type="text"
                                value={profile.location || ''}
                                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-pink-500/50 transition-colors"
                                placeholder="City, Country"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-white/60 mb-2">Website</label>
                            <input
                                type="url"
                                value={profile.website || ''}
                                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-pink-500/50 transition-colors"
                                placeholder="https://yourwebsite.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-[#0A0A0F] border-t border-white/10 p-6 flex gap-3">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1 h-12 rounded-xl border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-pink-500/20"
                    >
                        {loading ? (
                            'Saving...'
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditModal;
