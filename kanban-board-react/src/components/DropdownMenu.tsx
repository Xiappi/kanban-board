import { useState, useRef } from "react";

export interface DropdownEntry {
  key: string;
  label: string;
  callback: Function;
}

export default function DropdownMenu({
  children,
  entries,
}: {
  children: React.ReactNode;
  entries: DropdownEntry[];
}) {
  const [open, setOpen] = useState<boolean>(false);

  // checks if focus is lost on the dropdown elements
  const containerRef = useRef<HTMLDivElement>(null);
  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.relatedTarget as Node)
    ) {
      setOpen(false);
    }
  }

  return (
    <div
      className=" relative inline-block text-left dropdown"
      ref={containerRef}
      onBlur={handleBlur}
      tabIndex={-1}
    >
      <button type="button" onClick={() => setOpen(!open)}>
        {children}
      </button>
      <div className={`${open ? "" : "hidden"} dropdown-menu `}>
        <div
          className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
          aria-labelledby="headlessui-menu-button-1"
          id="headlessui-menu-items-117"
          role="menu"
        >
          <div className="py-1">
            {entries.map((entry) => (
              <div
                onClick={() => entry.callback()}
                className="text-gray-700 flex justify-between w-full px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                role="menuitem"
                key={entry.key}
              >
                {entry.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
