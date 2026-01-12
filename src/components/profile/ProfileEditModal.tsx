import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ProfileEditForm from './ProfileEditForm';

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, onSave }) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
                side="bottom"
                className="h-[90vh] bg-[#0A0A0F] border-t border-white/10 rounded-t-[40px] p-0 overflow-hidden"
            >
                {/* Drag Handle */}
                <div className="w-full flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1.5 rounded-full bg-white/20" />
                </div>

                {/* Header */}
                <SheetHeader className="px-6 pb-4 border-b border-white/10">
                    <SheetTitle className="text-2xl font-black text-white">Edit Profile</SheetTitle>
                </SheetHeader>

                {/* Form Content */}
                <div className="h-[calc(90vh-100px)]">
                    <ProfileEditForm
                        onSave={() => {
                            onSave();
                            onClose();
                        }}
                        onCancel={onClose}
                        isMobile={true}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ProfileEditModal;
