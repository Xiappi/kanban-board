import {
  Timestamp,
  type FirestoreDataConverter,
  type WithFieldValue,
  QueryDocumentSnapshot,
  type SnapshotOptions,
} from "firebase/firestore";
import type { ItemModel } from "../models/ItemModel";

type ItemWrite = Omit<ItemModel, "id">;

export const ItemModelConverter: FirestoreDataConverter<ItemModel, ItemWrite> =
  {
    toFirestore(b: WithFieldValue<ItemModel>) {
      return {
        name: b.name,
        description: b.description,
        created:
          b.created instanceof Date
            ? Timestamp.fromDate(b.created).toDate()
            : b.created,
        createdBy: b.createdBy,
        lastModified:
          b.lastModified instanceof Date
            ? Timestamp.fromDate(b.lastModified)
            : b.lastModified,
        lastModifiedBy: b.lastModifiedBy,
        swimlaneId: b.swimlaneId,
        boardId: b.boardId,
      };
    },
    fromFirestore(
      snap: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): ItemModel {
      const d = snap.data(options) as ItemModel;
      return {
        id: snap.id,
        name: d.name,
        description: d.description,
        created:
          d.created instanceof Timestamp ? d.created.toDate() : d.created,
        createdBy: d.createdBy,
        lastModified:
          d.lastModified instanceof Timestamp
            ? d.lastModified.toDate()
            : d.lastModified,
        lastModifiedBy: d.lastModifiedBy,
        swimlaneId: d.swimlaneId,
        boardId: d.boardId,
      };
    },
  };
