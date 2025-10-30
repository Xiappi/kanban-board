import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { BoardModelConverter } from "../db/BoardModelConverter";
import { db } from "../auth/firebase";
import Icon from "@mdi/react";
import { mdiChevronDown, mdiMagnify } from "@mdi/js";
import Swimlane from "../components/Swimlane";

export default function Board() {
  const { boardId } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState<any | null>(null);

  const collectionRef = collection(db, "boards").withConverter(
    BoardModelConverter
  );

  async function loadBoard() {
    if (!user?.email || !boardId) {
      return;
    }
    try {
      setLoading(true);
      const ref = doc(collectionRef, boardId);
      const snap = await getDoc(ref);
      setBoard(snap.data() ?? null);
    } catch (err) {
      setBoard(null);
      // TODO: Toaster
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, boardId]);

  if (loading) {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className="m-4 flex flex-col flex-grow">
        <div className="flex justify-between">
          <h3 className="text-3xl border-b-2 border-blue-300 pb-2 ">
            Kanban Board
          </h3>
          <div className="flex">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb- focus:outline-none "
            >
              <div className="flex items-center">
                <p>Add</p>
                <Icon path={mdiChevronDown} size={1}></Icon>
              </div>
            </button>

            <div>
              <div className="relative w-75">
                <input
                  type="search"
                  id="search-dropdown"
                  className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-gray-50 border-2 border border-gray-300 "
                  placeholder="Search Items"
                />
                <button
                  type="submit"
                  className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                >
                  <Icon path={mdiMagnify} size={1}></Icon>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="my-5 w-full flex items-center pl-3 h-10 rounded-lg bg-gradient-to-br from-gray-300 via-white to-white ">
          <h2 className="text-lg font-semibold">{board.name}</h2>
        </div>
        {/* <div className="w-full h-screen grid grid-cols-4 gap-4 bg-gradient-to-br from-blue-700 via-blue-500 to-blue-300 rounded-lg shadow-md"> */}
        <div className="w-full grid grid-cols-4 gap-4 h-[1200px] ">
          <Swimlane
            model={{
              name: "adam",
              id: "1",
              colorPrimary: "blue",
              colorSecondary: "blue",
            }}
          ></Swimlane>
        </div>
      </div>
    </>
  );
}
