import { Camera } from "lucide-react";
import { FeaturePageShell } from "../shared/FeaturePageShell";

export function SnapshotsPage() {
  return (
    <FeaturePageShell
      icon={Camera}
      title="Snapshots"
      description="Review screenshots attached across your technical notes."
    />
  );
}
