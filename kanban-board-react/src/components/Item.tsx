import type { ItemModel } from "../models/ItemModel";
import { getPaletteClasses } from "../providers/colorPaletteProvider";
import Popover from "./Popover";
import Icon from "@mdi/react";
import { mdiInformationOutline } from "@mdi/js";

export default function Item({
  model,
  colorPaletteKey,
  handleDragStart,
}: {
  model: ItemModel;
  colorPaletteKey: string;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
}) {
  const { border } = getPaletteClasses(colorPaletteKey);

  return (
    <>
      <div
        className={`w-full flex shadow-md flex-col bg-white border-l-6 ${border} rounded-xl px-4 py-3 mb-3 transition delay-75 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer`}
        draggable
        onDragStart={(e) => handleDragStart(e, model.id)}
      >
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold truncate">{model.name}</h4>
          <Popover
            trigger={<Icon path={mdiInformationOutline} size={0.75}></Icon>}
          >
            <p className="text-sm text-gray-400">
              Created On: {model.created.toDateString()}
            </p>
            <p className="text-sm text-gray-400">
              Created By: {model.createdBy}
            </p>
          </Popover>
        </div>
        <p className="text-sm text-gray-400">{model.description}</p>
      </div>
    </>
  );
}
