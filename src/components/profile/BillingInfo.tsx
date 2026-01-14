import React, { useState } from 'react';
import {
    Building,
    Mail,
    MapPin,
    Globe,
    Hash,
    Save,
    ChevronLeft,
    CreditCard
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface BillingInfoProps {
    onBack: () => void;
}

const BillingInfo: React.FC<BillingInfoProps> = ({ onBack }) => {
    const { user } = useAuth();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        businessName: user?.user_metadata?.business_name || '',
        billingEmail: user?.email || '',
        taxId: user?.user_metadata?.tax_id || '',
        address: user?.user_metadata?.address || '',
        city: user?.user_metadata?.city || '',
        state: user?.user_metadata?.state || '',
        zip: user?.user_metadata?.zip || '',
        country: user?.user_metadata?.country || 'India',
        paymentType: user?.user_metadata?.payment_type || 'card',
        upiId: user?.user_metadata?.upi_id || '',
        cardLast4: user?.user_metadata?.card_last4 || '4242',
        cardExpiry: user?.user_metadata?.card_expiry || '12/28',
        cardBrand: user?.user_metadata?.card_brand || 'visa'
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);

        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    business_name: formData.businessName,
                    tax_id: formData.taxId,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip,
                    country: formData.country,
                    payment_type: formData.paymentType,
                    upi_id: formData.upiId,
                    card_last4: formData.cardLast4,
                    card_expiry: formData.cardExpiry,
                    card_brand: formData.cardBrand
                }
            });

            if (error) throw error;

            toast({
                title: 'Billing Information Updated',
                description: 'Your details and payment preferences have been synced with nFKs Pay.',
                variant: 'success'
            });
        } catch (error: any) {
            toast({
                title: 'Save Failed',
                description: error.message || 'Could not update billing info.',
                variant: 'destructive'
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">Billing Information</h3>
                    <p className="text-muted-foreground text-sm font-medium">Manage your tax details and billing address.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-8 rounded-[32px] bg-secondary/30 border border-border space-y-8 shadow-theme-lg">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 px-1">Business Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground ml-1 flex items-center gap-2">
                                        <Building className="w-3 h-3" /> Business Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.businessName}
                                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                        placeholder="e.g. Acme Corp"
                                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/10 focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground ml-1 flex items-center gap-2">
                                        <Hash className="w-3 h-3" /> Tax ID / GSTIN
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.taxId}
                                        onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                                        placeholder="Enter GSTIN/VAT"
                                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/10 focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground ml-1 flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> Billing Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.billingEmail}
                                    onChange={(e) => setFormData({ ...formData, billingEmail: e.target.value })}
                                    placeholder="billing@example.com"
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/10 focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Address Info */}
                        <div className="space-y-4 pt-4 border-t border-border">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 px-1">Address</h4>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground ml-1 flex items-center gap-2">
                                        <MapPin className="w-3 h-3" /> Street Address
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="123 Cosmic Way"
                                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/10 focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground ml-1">City</label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground ml-1">State</label>
                                        <input
                                            type="text"
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1 space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground ml-1">Zip Code</label>
                                        <input
                                            type="text"
                                            value={formData.zip}
                                            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground ml-1 flex items-center gap-2">
                                        <Globe className="w-3 h-3" /> Country
                                    </label>
                                    <select
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                                    >
                                        <option>India</option>
                                        <option>United States</option>
                                        <option>United Kingdom</option>
                                        <option>Canada</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Payment Preferences */}
                        <div className="space-y-6 pt-4 border-t border-border">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 px-1">nFKs Pay Preferences</h4>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setFormData({ ...formData, paymentType: 'card' })}
                                    className={cn(
                                        "flex-1 py-3 px-4 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                        formData.paymentType === 'card'
                                            ? "bg-primary/10 border-primary/50 text-primary"
                                            : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <CreditCard className="w-4 h-4" /> Credit / Debit
                                </button>
                                <button
                                    onClick={() => setFormData({ ...formData, paymentType: 'upi' })}
                                    className={cn(
                                        "flex-1 py-3 px-4 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                        formData.paymentType === 'upi'
                                            ? "bg-green-500/10 border-green-500/50 text-green-500"
                                            : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Globe className="w-4 h-4" /> UPI / Virtual
                                </button>
                            </div>

                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                {formData.paymentType === 'upi' ? (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground ml-1">Universal UPI ID</label>
                                        <input
                                            type="text"
                                            value={formData.upiId}
                                            onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                                            placeholder="e.g. mayank@upi"
                                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-green-500/50 transition-colors"
                                        />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground ml-1">Card Number (Last 4)</label>
                                            <input
                                                type="text"
                                                maxLength={4}
                                                value={formData.cardLast4}
                                                onChange={(e) => setFormData({ ...formData, cardLast4: e.target.value })}
                                                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground ml-1">Expiry (MM/YY)</label>
                                            <input
                                                type="text"
                                                value={formData.cardExpiry}
                                                onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                                                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full py-4 bg-brand-gradient rounded-2xl font-black text-white uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-theme-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            {isSaving ? 'Saving Changes...' : (
                                <>
                                    <Save className="w-4 h-4" /> Save Information
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="p-6 rounded-[32px] bg-secondary/30 border border-border shadow-theme-md">
                        <h5 className="text-sm font-black text-foreground mb-4">Why this matters?</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                            We use this information to ensure your invoices are correct and compliant with local tax regulations. Correct details prevent issues during audits.
                        </p>
                    </div>

                    <div className="p-6 rounded-[32px] bg-secondary/30 border border-border shadow-theme-md">
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard className="w-5 h-5 text-primary" />
                            <h5 className="text-sm font-black text-foreground">Payment Method</h5>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium mb-4">
                            Your default payment method is used for automatic renewals.
                        </p>
                        <button
                            onClick={onBack}
                            className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-80 transition-colors"
                        >
                            Manage Payment Methods
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingInfo;
