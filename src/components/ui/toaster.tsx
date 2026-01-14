import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { CheckCircle2, AlertCircle, ShieldCheck, XCircle, Info, Loader2 } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        // Icon selection based on variant
        const renderIcon = () => {
          if (variant === 'destructive') return <XCircle className="w-5 h-5 text-red-500" />;
          if (variant === 'success') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
          if (variant === 'payment') return <ShieldCheck className="w-5 h-5 text-pink-500" />;
          if (variant === 'loading') return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;

          return (
            <img
              src="/ayscroll-official-logo.png"
              alt="AyScroll"
              className="w-full h-full object-cover"
            />
          );
        };

        return (
          <Toast key={id} variant={variant} {...props} className="flex-row items-center gap-3 py-3 px-4 min-w-fit max-w-sm">
            {/* Small Logo or Success/Error Icon - Left */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-md bg-black/20">
                {renderIcon()}
              </div>
            </div>

            {/* Compact Content - Right */}
            <div className="flex-1 min-w-0">
              {title && <ToastTitle className="text-white font-semibold text-sm leading-tight">{title}</ToastTitle>}
              {description && <ToastDescription className="text-white/50 text-xs leading-tight mt-0.5">{description}</ToastDescription>}
            </div>

            {action}
            <ToastClose className="flex-shrink-0 opacity-60 hover:opacity-100" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
