import type { ItemModel } from "../models/ItemModel";
import type { SwimlaneModel } from "../models/Swimlane";
import Item from "./Item";
import { useState } from "react";

export default function Swimlane({ model }: { model: SwimlaneModel }) {
  const [page, setPage] = useState(0);
  const itemsPerPage = 8;
  const testModel: ItemModel = {
    id: "1",
    name: "Test Name",
    description: "Test Desc",
    created: new Date(),
    createdBy: "Adam",
    lastModified: new Date(),
    lastModifiedBy: "Adam",
    swimlaneId: "1",
  };

  // Simulated list (replace with your data)
  const allItems: ItemModel[] = Array.from({ length: 15 }, (_, i) => ({
    ...testModel,
    id: String(i + 1),
  }));

  const visibleItems = allItems.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center h-15 border border-t-2 rounded-t-lg border-t-2 rounded-t-lg border-blue-200 bg-blue-400">
        <h3 className="text-2xl font-semibold">
          {model.name} ({allItems.length})
        </h3>
      </div>
      <div className="flex-1 bg-red-100 p-4 ">
        <div className="">
          {visibleItems.map((item) => (
            <Item model={testModel}></Item>
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
          disabled={(page + 1) * itemsPerPage >= allItems.length}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
