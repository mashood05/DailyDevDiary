import { Trash2 } from "lucide-react";
import { FeaturePageShell } from "../shared/FeaturePageShell";

export function TrashPage() {
  return (
    <FeaturePageShell
      icon={Trash2}
      title="Trash"
      description="Restore deleted work or remove it permanently."
    />
  );
}
