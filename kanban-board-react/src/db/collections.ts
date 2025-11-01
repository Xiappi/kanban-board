import { collection } from "firebase/firestore";
import { SwimlaneModelConverter } from "./SwimlaneConverter";
import { db } from "../auth/firebase";
import { BoardModelConverter } from "./BoardModelConverter";
import { ItemModelConverter } from "./ItemModelConverter";

export const swimlaneCollectionRef = collection(db, "swimlanes").withConverter(
  SwimlaneModelConverter
);

export const boardCollectionRef = collection(db, "boards").withConverter(
  BoardModelConverter
);

export const itemsCollectionRef = collection(db, "items").withConverter(
  ItemModelConverter
);
