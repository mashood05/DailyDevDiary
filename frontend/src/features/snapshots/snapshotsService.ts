import type { Note } from "../../data/diaryRepository";
import { invokeFeature } from "../shared/invokeFeature";

export type SnapshotRecord = {
  id: string;
  name: string;
  dataUrl: string;
  noteId: string;
  collectionId: string;
  noteTitle: string;
  stepTitle: string;
  updatedAt: string;
};

export function listSnapshots(notes: Note[]) {
  const input = notes.flatMap((note) =>
    note.steps.flatMap((step) =>
      step.screenshots.map((screenshot) => ({
        id: screenshot.id,
        name: screenshot.name,
        dataUrl: screenshot.dataUrl,
        noteId: note.id,
        collectionId: note.collectionId,
        noteTitle: note.title || "Untitled note",
        stepTitle: step.title || "Untitled step",
        updatedAt: note.updatedAt,
      })),
    ),
  );

  return invokeFeature<SnapshotRecord[]>("list_snapshots", { input }, () =>
    [...input].sort((first, second) => second.updatedAt.localeCompare(first.updatedAt)),
  );
}
