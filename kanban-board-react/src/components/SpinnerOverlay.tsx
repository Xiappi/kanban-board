import { useSpinnerGate } from "../hooks/useSpinnerGate";

export function SpinnerOverlay({
  loading,
  showAfter = 200,
  minVisible = 400,
  fadeMs = 200,
}: {
  loading: boolean;
  showAfter?: number;
  minVisible?: number;
  fadeMs?: number;
}) {
  const { mounted, visible } = useSpinnerGate(loading, {
    showAfter,
    minVisible,
    fadeMs,
  });

  if (!mounted) return null;

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={[
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-white/60",
        "transition-opacity duration-200", // keep in sync with fadeMs
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <div
        className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500"
        role="status"
      />
    </div>
  );
}
