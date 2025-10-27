import Icon from "@mdi/react";
import { mdiOpenInApp } from "@mdi/js";

export default function HomePage() {
  return (
    <div className="w-45 h-45 border rounded-lg mt-3 shadow-lg border-gray-200 flex justify-center items-center transition delay-75 ease-in-out hover:-translate-y-1 hover:scale-110">
      <div className="flex items-center">
        <h5 className="mb-1 mr-2 text-2xl font-semibold text-gray-900 ">
          Open
        </h5>
        <Icon path={mdiOpenInApp} size={2} />
      </div>
    </div>
  );
}
