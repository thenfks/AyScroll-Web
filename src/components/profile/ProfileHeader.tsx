import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Flame, BadgeCheck } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/database';
import { GradientButton } from '@/components/ui/GradientButton';
import { useToast } from "@/hooks/use-toast";
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  user: User;
  onEditClick?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditClick }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    if (data) {
      setProfile(data);
    }
  };

  // Strictly use Database Profile Tier
  const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'go';

  const { toast } = useToast();
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropping State
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleBannerClick = () => {
    console.log("Opening file picker...");
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset value to ensure onChange triggers even for same file
      fileInputRef.current.click();
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("onFileChange triggered", e);
    if (e.target.files && e.target.files.length > 0) {
      console.log("File selected:", e.target.files[0]);
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        console.log("FileReader loaded data");
        const result = reader.result as string;
        setImageSrc(result);
        setIsCropping(true);
        console.log("Set isCropping to true");
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      });
      reader.addEventListener('error', (err) => {
        console.error("FileReader error:", err);
      });
      reader.readAsDataURL(file);
    } else {
      console.log("No files found in event target");
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const uploadBannerImage = async (blob: Blob) => {
    try {
      setUploadingBanner(true);
      const fileExt = "jpeg";
      const fileName = `banner_${Date.now()}.${fileExt}`;
      const filePath = `banners/${user.id}/${fileName}`;

      console.log(`Uploading to user-uploads bucket: ${filePath}`);

      // Convert Blob to File for better compatibility
      const fileToFile = new File([blob], fileName, { type: 'image/jpeg' });

      // Upload to 'user-uploads' bucket (reusing existing bucket)
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, fileToFile, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      console.log("Generated Public URL:", publicUrl);

      // Update profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ cover_image_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, cover_image_url: publicUrl } : null);

      toast({
        title: "Success",
        description: "Banner updated successfully",
      });

    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Error uploading banner",
        description: error.message,
      });
    } finally {
      setUploadingBanner(false);
      setIsCropping(false);
      setImageSrc(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImageBlob) {
        await uploadBannerImage(croppedImageBlob);
      }
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Error cropping image",
        description: "Could not create cropped image",
      });
    }
  };

  const handleBannerRemove = async () => {
    if (!profile?.cover_image_url) return;

    try {
      setUploadingBanner(true);
      // Extract path from URL. Assuming standard structure: .../user-uploads/banners/user_id/filename
      const urlParts = profile.cover_image_url.split('/user-uploads/');
      const path = urlParts.length > 1 ? urlParts[1] : null;

      if (path) {
        await supabase.storage.from('user-uploads').remove([path]);
      }

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ cover_image_url: null })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, cover_image_url: null } : null);

      toast({
        title: "Banner Removed",
        description: "Your banner has been removed.",
      });

    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Error removing banner",
        description: e.message
      });
    } finally {
      setUploadingBanner(false);
    }
  };

  const defaultBanner = "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop";

  return (
    <div className="relative w-full rounded-[32px] md:rounded-[48px] bg-black border border-white/10 shadow-2xl overflow-hidden group">
      {/* Change Banner - Invisible Overlay Method */}
      <div
        className={`relative p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-all cursor-pointer ${uploadingBanner ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Change Banner"
      >
        <div className="w-5 h-5 flex items-center justify-center pointer-events-none">
          {uploadingBanner ? (
            <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
          )}
        </div>

        {/* The Input sits ON TOP of the button, invisible but clickable */}
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
          accept="image/*"
          onClick={(e) => {
            console.log("Input clicked directly!");
            // Important: Clear value so same file can be selected again
            (e.target as HTMLInputElement).value = '';
          }}
          onChange={(e) => {
            console.log("Overlay Input onChange fired!");
            onFileChange(e);
          }}
          disabled={uploadingBanner}
        />
      </div>

      {/* Profile Info Section */}
      <div className="relative px-6 md:px-10 pb-8 md:pb-10 pt-16 md:pt-[72px]">

        {/* Avatar - Overlapping */}
        <div className="absolute -top-16 md:-top-20 left-6 md:left-10 p-1.5 rounded-full bg-black">
          <div className={`relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-black ${isPro ? 'ring-4 ring-brand-purple' : 'ring-2 ring-white/10'}`}>
            <img
              src={profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.display_name || user.user_metadata?.name || 'User')}&background=random`}
              className="w-full h-full object-cover"
              alt={profile?.display_name || user.user_metadata?.name}
            />
          </div>
          {profile?.is_verified && (
            <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-1 border-4 border-black text-white" title="Verified Creator">
              <BadgeCheck className="w-4 h-4 md:w-5 md:h-5 fill-current" />
            </div>
          )}
        </div>

        {/* Actions (Top Right aligned with bottom of banner) */}
        <div className="absolute top-4 right-6 md:right-10 flex gap-3">
          <GradientButton
            onClick={onEditClick}
            round
            className="px-6 py-2 h-10 text-xs font-bold uppercase tracking-wider"
          >
            Edit Profile
          </GradientButton>
          <button className="px-6 py-2 h-10 rounded-full border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-colors">
            Share
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">

          {/* Text Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2">
              {profile?.display_name || user.user_metadata?.name || 'User'}
            </h1>
            <p className="text-lg text-primary font-bold font-mono mb-4">
              @{profile?.username || user.user_metadata?.username || 'user'}
              {isPro && <span className="ml-3 px-2 py-0.5 rounded text-[10px] bg-brand-gradient text-white font-black uppercase tracking-widest align-middle">PRO</span>}
            </p>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl font-medium mb-6">
              {profile?.bio || 'Product Designer & AI Enthusiast. Learning about Quantum Computing and UI Trends.'}
            </p>

            <div className="flex items-center gap-6 text-sm font-bold text-white">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/5">
                <span className="text-white text-lg">{profile?.followers_count || 0}</span>
                <span className="text-gray-500 text-xs uppercase tracking-wider">Followers</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/5">
                <span className="text-white text-lg">{profile?.following_count || 0}</span>
                <span className="text-gray-500 text-xs uppercase tracking-wider">Following</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/5">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-white text-lg">{profile?.current_streak_days || 0}</span>
                <span className="text-gray-500 text-xs uppercase tracking-wider">Streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cropper Dialog */}
      <Dialog open={isCropping} onOpenChange={setIsCropping}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Banner Image</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-64 bg-black/5 rounded-lg overflow-hidden">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={3 / 1} // Banner aspect ratio
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <div className="flex items-center gap-4 py-4">
            <span className="text-sm font-medium">Zoom</span>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value) => setZoom(value[0])}
              className="flex-1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCropping(false)}>Cancel</Button>
            <Button onClick={handleSaveCroppedImage} disabled={uploadingBanner}>
              {uploadingBanner ? "Saving..." : "Save Banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileHeader;
