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
};

export function FeatureRouter({
  feature,
  collections,
  notes,
  onOpenNote,
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
      return <CommandsPage />;
    case "snapshots":
      return <SnapshotsPage />;
    case "trash":
      return <TrashPage />;
    default:
      return (
        <HomePage collections={collections} notes={notes} onOpenNote={onOpenNote} />
      );
  }
}
