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
  const [page, setPage] = useState(0);
  const itemsPerPage = 8;

  const visibleItems = items.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const { bg, border, text } = getPaletteClasses(model.colorPaletteKey);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent default to allow drop
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

    if (event.dataTransfer) {
      const draggedId = event.dataTransfer.getData("text/plain");
      console.log("Dragged item: " + draggedId);
      console.log("Dragged to: " + targetSwimlaneId);

      if (draggedId) {
        onDrop(draggedId, targetSwimlaneId);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center justify-center h-16 rounded-t-lg border ${bg} ${border} ${text}`}
      >
        <h3 className="text-2xl font-semibold">
          {model.name} ({items.length})
        </h3>
      </div>
      <div
        className="flex-1 shadow-lg p-4 "
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, model.id)}
      >
        <div className="">
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
