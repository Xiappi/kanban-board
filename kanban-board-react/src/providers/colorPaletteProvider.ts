// providers/colorPaletteProvider.ts
export interface ColorPalette {
  name: string;
  key: string;
  colorPrimary: string; // e.g., "blue-400"
  colorSecondary: string; // e.g., "blue-200"

  // Ready-to-use Tailwind classes
  bgClass: string; // e.g., "bg-blue-400"
  borderClass: string; // e.g., "border-blue-200"
  textClass?: string; // optional: ensure good contrast
}

const fallbackPalette: ColorPalette = {
  name: "Fallback",
  key: "fallback",
  colorPrimary: "gray-400",
  colorSecondary: "gray-200",
  bgClass: "bg-gray-400",
  borderClass: "border-gray-200",
  textClass: "text-slate-900",
};

const palettes: ColorPalette[] = [
  {
    name: "Blue",
    key: "blue",
    colorPrimary: "blue-400",
    colorSecondary: "blue-200",
    bgClass: "bg-blue-400",
    borderClass: "border-blue-200",
    textClass: "text-white",
  },
  {
    name: "Yellow",
    key: "yellow",
    colorPrimary: "yellow-400",
    colorSecondary: "yellow-200",
    bgClass: "bg-yellow-400",
    borderClass: "border-yellow-200",
    textClass: "text-slate-900",
  },
  {
    name: "Green",
    key: "green",
    colorPrimary: "green-600",
    colorSecondary: "green-400",
    bgClass: "bg-green-600",
    borderClass: "border-green-600",
    textClass: "text-white",
  },
  {
    name: "Purple",
    key: "purple",
    colorPrimary: "purple-400",
    colorSecondary: "purple-200",
    bgClass: "bg-purple-400",
    borderClass: "border-purple-200",
    textClass: "text-white",
  },
  {
    name: "Red",
    key: "red",
    colorPrimary: "red-400",
    colorSecondary: "red-200",
    bgClass: "bg-red-400",
    borderClass: "border-red-200",
    textClass: "text-white",
  },
];

export default function getColorPaletteFor(key: string): ColorPalette {
  return palettes.find((p) => p.key === key) ?? fallbackPalette;
}

// (optional) a helper that returns just the classes you need
export function getPaletteClasses(key: string) {
  const p = getColorPaletteFor(key);
  return { bg: p.bgClass, border: p.borderClass, text: p.textClass ?? "" };
}
