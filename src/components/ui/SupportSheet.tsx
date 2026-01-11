import React, { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send } from 'lucide-react';

interface SupportSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const SupportSheet: React.FC<SupportSheetProps> = ({ open, onOpenChange }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset form after 2 seconds
        setTimeout(() => {
            setFormData({ name: '', email: '', subject: '', message: '' });
            setIsSubmitted(false);
            onOpenChange(false);
        }, 2000);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="bg-zinc-950 border-white/10 text-white sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold text-white flex items-center gap-2">
                        <img src="/ayscroll-official-logo.png" alt="AyScroll" className="w-10 h-10 object-contain" />
                        Contact Support
                    </SheetTitle>
                    <SheetDescription className="text-zinc-400">
                        Have a question or need help? We're here for you.
                    </SheetDescription>
                </SheetHeader>

                {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                            <Send className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Message Sent!</h3>
                        <p className="text-zinc-400 text-center">
                            We'll get back to you at {formData.email} soon.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Name</label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Your name"
                                className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-500 focus:border-pink-500 focus:ring-pink-500/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Email</label>
                            <Input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="your.email@example.com"
                                className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-500 focus:border-pink-500 focus:ring-pink-500/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Subject</label>
                            <Input
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="What's this about?"
                                className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-500 focus:border-pink-500 focus:ring-pink-500/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Message</label>
                            <Textarea
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Tell us how we can help..."
                                rows={5}
                                className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-500 focus:border-pink-500 focus:ring-pink-500/20 resize-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-pink-500/20"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Sending...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Send className="w-4 h-4" />
                                    Send Message
                                </div>
                            )}
                        </Button>

                        <p className="text-xs text-zinc-500 text-center">
                            Or email us directly at{' '}
                            <a href="mailto:support@ayscroll.com" className="text-pink-500 hover:text-pink-400">
                                support@ayscroll.com
                            </a>
                        </p>
                    </form>
                )}
            </SheetContent>
        </Sheet>
    );
};
