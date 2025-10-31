import type { ItemModel } from "../models/ItemModel";
import type { SwimlaneModel } from "../models/Swimlane";
import { getPaletteClasses } from "../providers/colorPaletteProvider";
import Item from "./Item";
import { useState } from "react";
import Icon from "@mdi/react";
import { mdiSelectPlace } from "@mdi/js";

export default function Swimlane({
  model,
  items,
  onDrop,
}: {
  model: SwimlaneModel;
  items: ItemModel[];
  onDrop: (itemId: string, swimlaneId: string) => void;
}) {
  const [page, setPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const itemsPerPage = 8;

  const visibleItems = items.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

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
      className={`flex flex-col relative transition delay-75 ease-in-out ${
        isDragging ? "-translate-y-1 scale-102" : ""
      }`}
    >
      <div
        className={`flex items-center justify-center h-16 rounded-t-lg border ${bg} ${border} ${text}`}
      >
        <h3 className="text-2xl font-semibold">
          {model.name} ({items.length})
        </h3>
      </div>
      <div
        className={`flex-1 bg-slate-50 border-r-1 border-b-1 border-l-1 border-gray-300 shadow-xl p-4 ${
          isDragging ? "opacity-50" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, model.id)}
      >
        {isDragging && (
          <div className="absolute top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-md border-2 border-dashed text-black px-4 py-2 rounded">
              Move Here
            </div>
          </div>
        )}
        <div>
          {visibleItems.map((item) => (
            <Item
              model={item}
              colorPaletteKey={model.colorPaletteKey}
              handleDragStart={handleDragStart}
              key={item.id}
            ></Item>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-2">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        >
          Prev
        </button>
        <button
          disabled={(page + 1) * itemsPerPage >= items.length}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
