
import { toast as sonnerToast, type Toast } from "sonner";

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

// Re-export the toast function from sonner
export const toast = sonnerToast;

// Our custom hook for toast functionality
export function useToast() {
  return {
    toast: sonnerToast,
  };
}

export type { ToastProps };
