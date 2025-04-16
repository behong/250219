// src/components/ui/use-toast.ts
import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "destructive" | "success" | "info";

interface ToastOptions {
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useToast() {
  const toast = ({
    description,
    variant = "default",
    duration = 3000,
    action,
  }: ToastOptions) => {
    sonnerToast(description || "", {
      duration,
      className:
        variant === "destructive"
          ? "bg-red-500 text-white"
          : variant === "success"
          ? "bg-green-500 text-white"
          : variant === "info"
          ? "bg-blue-500 text-white"
          : "",
      action,
    });
  };

  return { toast };
}
