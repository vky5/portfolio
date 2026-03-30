"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, Loader2, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "loading" | "confirm";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  loading: (message: string) => number;
  confirm: (message: string) => Promise<boolean>;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info", duration = 3000) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type, duration }]);

      if (type !== "loading" && type !== "confirm") {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const success = (msg: string, dur?: number) => toast(msg, "success", dur);
  const error = (msg: string, dur?: number) => toast(msg, "error", dur);
  const info = (msg: string, dur?: number) => toast(msg, "info", dur);
  const loading = (msg: string) => toast(msg, "loading");

  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const id = Date.now();
      const onConfirm = () => {
        dismiss(id);
        resolve(true);
      };
      const onCancel = () => {
        dismiss(id);
        resolve(false);
      };

      setToasts((prev) => [
        ...prev,
        { id, message, type: "confirm", onConfirm, onCancel },
      ]);
    });
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, loading, confirm, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    loading: <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />,
    confirm: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  };

  const bgColors = {
    success: "bg-emerald-500/10 border-emerald-500/20",
    error: "bg-rose-500/10 border-rose-500/20",
    info: "bg-blue-500/10 border-blue-500/20",
    loading: "bg-neutral-500/10 border-neutral-500/20",
    confirm: "bg-amber-500/10 border-amber-500/20 shadow-amber-500/5",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)", transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex flex-col gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${bgColors[toast.type]} min-w-[300px]`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{icons[toast.type]}</div>
        <p className="flex-1 text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-tight">
          {toast.message}
        </p>
        {toast.type !== "confirm" && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-neutral-400" />
          </button>
        )}
      </div>

      {toast.type === "confirm" && (
        <div className="flex items-center justify-end gap-2 ml-8">
          <button
            onClick={toast.onCancel}
            className="px-3 py-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={toast.onConfirm}
            className="px-4 py-1.5 text-xs font-bold bg-amber-500 text-white rounded-lg hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            Confirm
          </button>
        </div>
      )}
    </motion.div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
