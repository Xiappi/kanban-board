import React, { useEffect, useRef, useState } from "react";

export type RowAction = {
  id: string;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export function RowActionsMenu({
  actions,
  stopRowClick = true,
  align = "end", // 'start' | 'end'
  ariaLabel = "Row actions",
  buttonClassName = "",
  menuClassName = "",
  renderTrigger,
}: {
  actions: RowAction[];
  /** prevent parent (row) click handlers */
  stopRowClick?: boolean;
  /** menu alignment relative to trigger button */
  align?: "start" | "end";
  /** accessible label for the menu */
  ariaLabel?: string;
  /** extra classes for the trigger button */
  buttonClassName?: string;
  /** extra classes for the dropdown menu */
  menuClassName?: string;
  /** optional custom trigger renderer */
  renderTrigger?: (props: {
    open: boolean;
    toggle: (e: React.MouseEvent) => void;
    ref: React.Ref<HTMLButtonElement>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const toggle = (e: React.MouseEvent) => {
    if (stopRowClick) e.stopPropagation();
    setOpen((v) => !v);
  };

  const handleItemClick =
    (cb: (e: React.MouseEvent) => void, disabled?: boolean) =>
    (e: React.MouseEvent) => {
      if (stopRowClick) e.stopPropagation();
      if (disabled) return;
      cb(e);
      setOpen(false);
    };

  const trigger = renderTrigger?.({ open, toggle, ref: btnRef }) ?? (
    <button
      ref={btnRef}
      onClick={toggle}
      aria-haspopup="menu"
      aria-expanded={open}
      className={[
        "inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400",
        buttonClassName,
      ].join(" ")}
    >
      {/* Hamburger icon (swap for kebab if you like) */}
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{ariaLabel}</span>
    </button>
  );

  return (
    <div className="relative inline-block text-left">
      {trigger}

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={ariaLabel}
          className={[
            "absolute z-20 mt-2 w-44 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none",
            align === "end" ? "right-0" : "left-0",
            menuClassName,
          ].join(" ")}
          onClick={(e) => stopRowClick && e.stopPropagation()}
        >
          {actions.map((a) => (
            <button
              key={a.id}
              role="menuitem"
              disabled={a.disabled}
              onClick={handleItemClick(a.onClick, a.disabled)}
              className={[
                "w-full px-3 py-2 text-left text-sm focus:outline-none",
                a.disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50 focus:bg-gray-50",
              ].join(" ")}
            >
              <span className="inline-flex items-center gap-2">
                {a.icon ?? null}
                {a.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
