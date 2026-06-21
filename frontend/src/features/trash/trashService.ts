import type { Collection, Note } from "../../data/diaryTypes";
import { invokeFeature } from "../shared/invokeFeature";

export type TrashOrder = {
  collectionIds: string[];
  noteIds: string[];
};

export function listTrash(collections: Collection[], notes: Note[]) {
  const input = {
    collections: collections.map((collection) => ({
      id: collection.id,
      deletedAt: collection.deletedAt || "",
    })),
    notes: notes.map((note) => ({
      id: note.id,
      deletedAt: note.deletedAt || "",
    })),
  };

  return invokeFeature<TrashOrder>("list_trash", { input }, () => ({
    collectionIds: [...input.collections]
      .sort((first, second) => second.deletedAt.localeCompare(first.deletedAt))
      .map((item) => item.id),
    noteIds: [...input.notes]
      .sort((first, second) => second.deletedAt.localeCompare(first.deletedAt))
      .map((item) => item.id),
  }));
}
