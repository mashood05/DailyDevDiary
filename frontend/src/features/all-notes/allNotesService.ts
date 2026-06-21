import type { Note } from "../../data/diaryRepository";
import { invokeFeature } from "../shared/invokeFeature";

export function listAllNoteIds(notes: Note[]) {
  const input = notes.map((note) => ({ id: note.id, updatedAt: note.updatedAt }));

  return invokeFeature<string[]>("list_all_notes", { input }, () =>
    [...input]
      .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt))
      .map((note) => note.id),
  );
}
