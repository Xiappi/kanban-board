import type { ItemModel } from "../models/ItemModel";
import type { SwimlaneModel } from "../models/Swimlane";
import { getPaletteClasses } from "../providers/colorPaletteProvider";
import Item from "./Item";
import { useState } from "react";

export default function Swimlane({
  model,
  items,
  onDrop,
}: {
  model: SwimlaneModel;
  items: ItemModel[];
  onDrop: (itemId: string, swimlaneId: string) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const { bg, border, text } = getPaletteClasses(model.colorPaletteKey);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent default to allow drop
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    id: string
  ) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData("text/plain", id);
    }
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    targetSwimlaneId: string
  ) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer) {
      const draggedId = event.dataTransfer.getData("text/plain");

      if (draggedId) {
        onDrop(draggedId, targetSwimlaneId);
      }
    }
  };

  return (
    <div
      className={`flex flex-col relative min-h-[40vh] max-h-[78vh] transition delay-75 ease-in-out  ${
        isDragging ? "-translate-y-1 scale-102" : ""
      } `}
    >
      {/* Header stays fixed height */}
      <div
        className={`flex items-center justify-center h-16 rounded-t-lg border ${bg} ${border} ${text}`}
      >
        <h3 className="text-2xl font-semibold">
          {model.name} ({items.length})
        </h3>
      </div>

      {/* Body grows until max-h is reached, then scrolls */}
      <div
        className={`flex-1 bg-slate-50 border-r-1 border-b-1 border-l-1 border-gray-300 shadow-xl p-4 ${
          isDragging ? "opacity-50" : ""
        } overflow-y-auto`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, model.id)}
      >
        {isDragging && (
          <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-md border-2 border-dashed text-black px-4 py-2">
              Move Here
            </div>
          </div>
        )}

        <div className="space-y-2">
          {items.map((item) => (
            <Item
              key={item.id}
              model={item}
              colorPaletteKey={model.colorPaletteKey}
              handleDragStart={handleDragStart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
