import { SquareTerminal } from "lucide-react";
import { FeaturePageShell } from "../shared/FeaturePageShell";

export function CommandsPage() {
  return (
    <FeaturePageShell
      icon={SquareTerminal}
      title="Commands"
      description="Find and reuse commands saved inside your setup steps."
    />
  );
}
