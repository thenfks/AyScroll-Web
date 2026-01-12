import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="flex-col items-center text-center min-w-[280px] max-w-[320px]">
            {/* Logo Icon - Top */}
            <div className="mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center shadow-lg">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    fill="currentColor"
                    opacity="0.8"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Content - Bottom */}
            <div className="w-full space-y-1">
              {title && <ToastTitle className="text-white font-bold text-base">{title}</ToastTitle>}
              {description && <ToastDescription className="text-white/60 text-sm">{description}</ToastDescription>}
            </div>

            {action}
            <ToastClose className="absolute top-2 right-2" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
