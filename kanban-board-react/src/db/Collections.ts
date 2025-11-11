import { collection } from "firebase/firestore";
import { SwimlaneModelConverter } from "./SwimlaneConverter";
import { db } from "../auth/firebase";
import { BoardModelConverter } from "./BoardModelConverter";
import { ItemModelConverter } from "./ItemModelConverter";
import type { SwimlaneModel } from "../models/Swimlane";
import type { BoardModel } from "../models/BoardModel";
import type { ItemModel } from "../models/ItemModel";

export const swimlaneCollectionRef = collection(
  db,
  "swimlanes"
).withConverter<SwimlaneModel>(SwimlaneModelConverter);

export const boardCollectionRef = collection(
  db,
  "boards"
).withConverter<BoardModel>(BoardModelConverter);

export const itemsCollectionRef = collection(
  db,
  "items"
).withConverter<ItemModel>(ItemModelConverter);
