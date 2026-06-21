import type { Note } from "../../data/diaryRepository";
import { invokeFeature } from "../shared/invokeFeature";

export type CommandRecord = {
  id: string;
  command: string;
  noteId: string;
  collectionId: string;
  noteTitle: string;
  stepTitle: string;
  updatedAt: string;
};

export function listCommands(notes: Note[]) {
  const input = notes.flatMap((note) =>
    note.steps
      .filter((step) => step.command.trim())
      .map((step) => ({
        id: `${note.id}:${step.id}`,
        command: step.command,
        noteId: note.id,
        collectionId: note.collectionId,
        noteTitle: note.title || "Untitled note",
        stepTitle: step.title || "Untitled step",
        updatedAt: note.updatedAt,
      })),
  );

  return invokeFeature<CommandRecord[]>("list_commands", { input }, () =>
    [...input].sort((first, second) => second.updatedAt.localeCompare(first.updatedAt)),
  );
}
