import {
  Timestamp,
  type FirestoreDataConverter,
  type WithFieldValue,
  QueryDocumentSnapshot,
  type SnapshotOptions,
} from "firebase/firestore";
import type { CardBoardModel } from "../models/CardBoardModel";

type CardBoardWrite = Omit<CardBoardModel, "id">;

export const CardBoardModelConverter: FirestoreDataConverter<
  CardBoardModel,
  CardBoardWrite
> = {
  toFirestore(b: WithFieldValue<CardBoardModel>) {
    return {
      name: b.name,
      description: b.description,
      created:
        b.created instanceof Date ? Timestamp.fromDate(b.created) : b.created,
      lastModified:
        b.lastModified instanceof Date
          ? Timestamp.fromDate(b.lastModified)
          : b.lastModified,

      lastModifiedBy: b.lastModifiedBy,
      user: b.user,
    };
  },
  fromFirestore(
    snap: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): CardBoardModel {
    const d = snap.data(options) as CardBoardModel;
    return {
      id: snap.id,
      name: d.name,
      description: d.description,
      created: d.created,
      lastModified: d.lastModified,
      lastModifiedBy: d.lastModifiedBy,
      user: d.user,
    };
  },
};
