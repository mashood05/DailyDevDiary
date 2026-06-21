import { Files } from "lucide-react";
import { FeaturePageShell } from "../shared/FeaturePageShell";

export function AllNotesPage() {
  return (
    <FeaturePageShell
      icon={Files}
      title="All Notes"
      description="Browse notes from every collection in one place."
    />
  );
}
