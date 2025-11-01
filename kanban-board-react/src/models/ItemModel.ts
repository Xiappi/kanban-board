export interface ItemModel {
  id: string;
  name: string;
  description: string;
  created: Date;
  createdBy: string;
  lastModified: Date;
  lastModifiedBy: string;
  swimlaneId: string;
  boardId: string;
}
