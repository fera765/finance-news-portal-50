
import { toast as sonnerToast } from "sonner";

// Re-export the toast function from sonner
export const toast = sonnerToast;

// Our custom hook for toast functionality
export function useToast() {
  return {
    toast: sonnerToast,
  };
}

export type ToastProps = Parameters<typeof sonnerToast>[1];
