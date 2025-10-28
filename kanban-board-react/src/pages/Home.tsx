import CardBoard from "../components/CardBoard";
import type { CardBoardModel } from "../models/CardBoardModel";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import { useState, useEffect } from "react";
import { auth, db } from "../auth/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../auth/AuthProvider";
import { CardBoardModelConverter } from "../db/CardBoardModelConverter";

export default function HomePage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [boards, setBoards] = useState<CardBoardModel[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    async function loadBoards() {
      if (!user?.email) {
        return;
      }

      setLoading(true);

      const q = query(
        collection(db, "boards"),
        where("user", "==", user?.email)
      ).withConverter(CardBoardModelConverter);

      const snapshot = await getDocs(q);
      const boards: CardBoardModel[] = snapshot.docs.map((d) => d.data());

      setBoards(boards);

      setLoading(false);
    }

    loadBoards();
  }, []);
  return (
    <>
      <div className="flex flex-wrap w-full gap-x-8 gap-y-6 mt-4">
        {boards.map((board) => (
          <CardBoard key={board.id} model={board}></CardBoard>
        ))}
        <button
          // onClick={() => setCounter(counter + 1)}
          className="mt-7.5 mx-15 size-32 flex items-center border rounded-lg mt-3 shadow-lg border-gray-200 flex flex-wrap transition delay-75 ease-in-out hover:-translate-y-1 hover:scale-110 "
        >
          <Icon className="opacity-50" path={mdiPlus} size={5} />
        </button>
      </div>
    </>
  );
}
