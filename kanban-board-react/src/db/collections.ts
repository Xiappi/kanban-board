import { collection } from "firebase/firestore";
import { SwimlaneModelConverter } from "./SwimlaneConverter";
import { db } from "../auth/firebase";
import { BoardModelConverter } from "./BoardModelConverter";

export const swimlaneCollectionRef = collection(db, "swimlanes").withConverter(
  SwimlaneModelConverter
);

export const boardCollectionRef = collection(db, "boards").withConverter(
  BoardModelConverter
);
