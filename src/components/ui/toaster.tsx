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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center shadow-md">
                <svg
                  width="18"
                  height="18"
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
