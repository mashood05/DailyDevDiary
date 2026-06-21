import type { Collection, Note } from "../../data/diaryRepository";
import { invokeFeature } from "../shared/invokeFeature";

export type HomeSummary = {
  collectionCount: number;
  noteCount: number;
  commandCount: number;
  snapshotCount: number;
  recentNoteIds: string[];
};

export function getHomeSummary(collections: Collection[], notes: Note[]) {
  const input = {
    collectionCount: collections.length,
    notes: notes.map((note) => ({
      id: note.id,
      updatedAt: note.updatedAt,
      commandCount: note.steps.filter((step) => step.command.trim()).length,
      snapshotCount: note.steps.reduce(
        (total, step) => total + step.screenshots.length,
        0,
      ),
    })),
  };

  return invokeFeature<HomeSummary>("get_home_summary", { input }, () => ({
    collectionCount: input.collectionCount,
    noteCount: input.notes.length,
    commandCount: input.notes.reduce((total, note) => total + note.commandCount, 0),
    snapshotCount: input.notes.reduce((total, note) => total + note.snapshotCount, 0),
    recentNoteIds: [...input.notes]
      .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt))
      .slice(0, 5)
      .map((note) => note.id),
  }));
}
