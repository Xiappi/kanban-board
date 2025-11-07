import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

type ToastType = "success" | "error" | "info" | "warn";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let addToastGlobal: (toast: Toast) => void;

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // expose addToast function globally
  useEffect(() => {
    addToastGlobal = (toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    };
  }, []);

  const colors: Record<ToastType, string> = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warn: "bg-yellow-500 text-black",
  };

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${
            colors[toast.type]
          } text-white px-4 py-2 rounded-lg shadow-md animate-fade-in`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

// ?? static API
function push(type: ToastType, message: string) {
  if (!addToastGlobal) {
    // if not mounted yet, create container dynamically
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);
    root.render(<Toaster />);
    setTimeout(() => push(type, message), 50); // retry shortly
    return;
  }

  const id = Math.random().toString(36).substring(2, 9);
  addToastGlobal({ id, message, type });
}

Toaster.success = (msg: string) => push("success", msg);
Toaster.error = (msg: string) => push("error", msg);
Toaster.info = (msg: string) => push("info", msg);
Toaster.warn = (msg: string) => push("warn", msg);
