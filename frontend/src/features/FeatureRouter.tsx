import { AllNotesPage } from "./all-notes/AllNotesPage";
import { CommandsPage } from "./commands/CommandsPage";
import { HomePage } from "./home/HomePage";
import { SnapshotsPage } from "./snapshots/SnapshotsPage";
import { TrashPage } from "./trash/TrashPage";
import type { Collection, Note } from "../data/diaryRepository";
import type { FeatureKey } from "./types";

type FeatureRouterProps = {
  feature: FeatureKey;
  collections: Collection[];
  notes: Note[];
  onOpenNote: (collectionId: string, noteId: string) => void;
  deletedCollections: Collection[];
  deletedNotes: Note[];
  onRestoreCollection: (id: string) => Promise<void>;
  onPermanentlyDeleteCollection: (id: string) => Promise<void>;
  onRestoreNote: (id: string) => Promise<void>;
  onPermanentlyDeleteNote: (id: string) => Promise<void>;
};

export function FeatureRouter({
  feature,
  collections,
  notes,
  onOpenNote,
  deletedCollections,
  deletedNotes,
  onRestoreCollection,
  onPermanentlyDeleteCollection,
  onRestoreNote,
  onPermanentlyDeleteNote,
}: FeatureRouterProps) {
  switch (feature) {
    case "all-notes":
      return (
        <AllNotesPage
          collections={collections}
          notes={notes}
          onOpenNote={onOpenNote}
        />
      );
    case "commands":
      return <CommandsPage notes={notes} onOpenNote={onOpenNote} />;
    case "snapshots":
      return <SnapshotsPage notes={notes} onOpenNote={onOpenNote} />;
    case "trash":
      return (
        <TrashPage
          collections={deletedCollections}
          notes={deletedNotes}
          onRestoreCollection={onRestoreCollection}
          onDeleteCollection={onPermanentlyDeleteCollection}
          onRestoreNote={onRestoreNote}
          onDeleteNote={onPermanentlyDeleteNote}
        />
      );
    default:
      return (
        <HomePage collections={collections} notes={notes} onOpenNote={onOpenNote} />
      );
  }
}
