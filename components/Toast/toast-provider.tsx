import Toast from "@/components/Toast/toast";
import React, { createContext, useCallback, useContext, useState } from "react";

export type ToastVariant = "success" | "error" | "warning";

type ToastState = {
  visible: boolean;
  message: string;
  variant: ToastVariant;
  duration: number;
  icon?: React.ReactNode;
};

type ToastOptions = {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  icon?: React.ReactNode;
};

type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
};

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
  hideToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
    variant: "success",
    duration: 1000,
  });

  const showToast = useCallback((options: ToastOptions) => {
    setToast({
      visible: true,
      message: options.message,
      variant: options.variant ?? "success",
      duration: options.duration ?? 1000,
      icon: options.icon,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((current) => ({ ...current, visible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      <>
        {children}
        <Toast
          visible={toast.visible}
          message={toast.message}
          variant={toast.variant}
          duration={toast.duration}
          icon={toast.icon}
          onHide={hideToast}
        />
      </>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
