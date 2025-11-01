import {
  Timestamp,
  type FirestoreDataConverter,
  type WithFieldValue,
  QueryDocumentSnapshot,
  type SnapshotOptions,
} from "firebase/firestore";
import type { BoardModel } from "../models/BoardModel";

type BoardWrite = Omit<BoardModel, "id">;

export const BoardModelConverter: FirestoreDataConverter<
  BoardModel,
  BoardWrite
> = {
  toFirestore(b: WithFieldValue<BoardModel>) {
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
  ): BoardModel {
    const d = snap.data(options) as BoardModel;
    return {
      id: snap.id,
      name: d.name,
      description: d.description,
      created: d.created instanceof Timestamp ? d.created.toDate() : d.created,
      lastModified:
        d.lastModified instanceof Timestamp
          ? d.lastModified.toDate()
          : d.lastModified,
      lastModifiedBy: d.lastModifiedBy,
      user: d.user,
    };
  },
};
