export default function DropdownMenu({
  children,
  shouldOpen,
  onClose,
}: {
  children: React.ReactNode;
  shouldOpen: boolean;
  onClose: Function;
}) {
  return (
    <div
      className={`flex items-center justify-center  transition ease-in-out delay-75 ${
        shouldOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {shouldOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50"
          onClick={() => onClose()} // click outside closes modal
        >
          <div
            className="w-96 rounded-lg bg-white p-6 shadow-lg z-50"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
