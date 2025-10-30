import {
  type FirestoreDataConverter,
  type WithFieldValue,
  QueryDocumentSnapshot,
  type SnapshotOptions,
} from "firebase/firestore";
import type { SwimlaneModel } from "../models/Swimlane";

type swimlaneWrite = Omit<SwimlaneModel, "id">;

export const SwimlaneModelConverter: FirestoreDataConverter<
  SwimlaneModel,
  swimlaneWrite
> = {
  toFirestore(b: WithFieldValue<SwimlaneModel>) {
    return {
      name: b.name,
      colorPaletteKey: b.colorPaletteKey,
      order: b.order,
    };
  },
  fromFirestore(
    snap: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): SwimlaneModel {
    const d = snap.data(options) as SwimlaneModel;
    return {
      id: snap.id,
      name: d.name,
      colorPaletteKey: d.colorPaletteKey,
      order: d.order,
    };
  },
};
