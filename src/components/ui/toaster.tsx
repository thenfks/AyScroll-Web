import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="flex-row items-center gap-3 py-3 px-4 min-w-fit max-w-sm">
            {/* Small Logo Icon - Left */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-md bg-black/20">
                <img
                  src="/ayscroll-official-logo.png"
                  alt="AyScroll"
                  className="w-full h-full object-cover"
                />
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
