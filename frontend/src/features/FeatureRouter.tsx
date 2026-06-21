import { AllNotesPage } from "./all-notes/AllNotesPage";
import { CommandsPage } from "./commands/CommandsPage";
import { HomePage } from "./home/HomePage";
import { SnapshotsPage } from "./snapshots/SnapshotsPage";
import { TrashPage } from "./trash/TrashPage";
import type { FeatureKey } from "./types";

type FeatureRouterProps = {
  feature: FeatureKey;
};

export function FeatureRouter({ feature }: FeatureRouterProps) {
  switch (feature) {
    case "all-notes":
      return <AllNotesPage />;
    case "commands":
      return <CommandsPage />;
    case "snapshots":
      return <SnapshotsPage />;
    case "trash":
      return <TrashPage />;
    default:
      return <HomePage />;
  }
}
