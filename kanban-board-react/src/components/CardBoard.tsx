import type { CardBoardModel } from "../models/CardBoardModel";
import Icon from "@mdi/react";
import { mdiArrowRight, mdiPencilOutline } from "@mdi/js";

export default function CardBoard({ model }: { model: CardBoardModel }) {
  return (
    <div className="w-75 h-45 border rounded-lg mt-3 shadow-lg border-gray-200 flex flex-wrap transition delay-75 ease-in-out hover:-translate-y-1 hover:scale-110 ">
      <div className="w-full h-17.5 flex justify-center items-center flex-col text-md font-bold tracking-tight text-gray-900 bg-slate-200 ">
        <h5>{model.name}</h5>
        <div className="flex pl-2 pb-2 items-center">
          <p className="text-sm text-gray-600">{model.description}</p>
        </div>
      </div>

      <div className="w-lg flex transition ease-in-out delay-75">
        <div className="w-full flex justify-between items-end p-2">
          <span className=" border rounded-full border-white bg-white hover:bg-gray-200 cursor-pointer">
            <Icon className="p-[4px]" path={mdiPencilOutline} size={2} />
          </span>
          <span>
            <button className="flex text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer">
              <h5>Open</h5>
              <Icon path={mdiArrowRight} size={1}></Icon>
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
