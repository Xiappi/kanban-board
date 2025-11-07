import { useState, useRef, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number; // optional hover delay in ms
}

export default function Popover({
  trigger,
  children,
  position = "bottom",
  delay = 100,
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number>(1000);

  // Position the popover
  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const offset = 8;
      const pos = { top: 0, left: 0 };

      switch (position) {
        case "top":
          pos.top = rect.top - offset;
          pos.left = rect.left + rect.width / 2;
          break;
        case "bottom":
          pos.top = rect.bottom + offset;
          pos.left = rect.left + rect.width / 2;
          break;
        case "left":
          pos.top = rect.top + rect.height / 2;
          pos.left = rect.left - offset;
          break;
        case "right":
          pos.top = rect.top + rect.height / 2;
          pos.left = rect.right + offset;
          break;
      }

      setCoords(pos);
    }
  }, [open, position]);

  // Clean up any pending timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={triggerRef}
      className="inline-block relative"
      onMouseEnter={() => {
        timeoutRef.current = window.setTimeout(() => setOpen(true), delay);
      }}
      onMouseLeave={() => {
        window.clearTimeout(timeoutRef.current);
        setOpen(false);
      }}
    >
      {trigger}

      {open &&
        createPortal(
          <div
            className="fixed z-[9999] bg-white border rounded-lg shadow-lg p-2 text-sm w-56 animate-fade-in pointer-events-none"
            style={{
              top:
                position === "top" || position === "bottom"
                  ? `${coords.top}px`
                  : `${coords.top}px`,
              left:
                position === "left" || position === "right"
                  ? `${coords.left}px`
                  : `${coords.left}px`,
              transform:
                position === "top" || position === "bottom"
                  ? "translateX(-50%)"
                  : "translateY(-50%)",
            }}
          >
            {children}
          </div>,
          document.body
        )}
    </div>
  );
}
