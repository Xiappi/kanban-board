import type { ItemModel } from "../models/ItemModel";
import { getPaletteClasses } from "../providers/colorPaletteProvider";

export default function Item({
  model,
  colorPaletteKey,
}: {
  model: ItemModel;
  colorPaletteKey: string;
}) {
  const { border } = getPaletteClasses(colorPaletteKey);
  return (
    <>
      <div
        className={`w-full h-30 flex flex-col bg-gray-100 border-l-6 ${border} rounded-xl px-4 pt-3 mb-3 transition delay-75 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer`}
      >
        <h4 className="text-lg font-semibold ">{model.name}</h4>
        <p className="text-sm text-gray-400">{model.description}</p>
        <p className="text-sm text-gray-400">
          Created On: {model.created.toDateString()}
        </p>
        <p className="text-sm text-gray-400">Created By: {model.createdBy}</p>
      </div>
    </>
  );
}
