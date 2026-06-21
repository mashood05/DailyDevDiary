import { Home } from "lucide-react";
import { FeaturePageShell } from "../shared/FeaturePageShell";

export function HomePage() {
  return (
    <FeaturePageShell
      icon={Home}
      title="Home"
      description="A clear overview of your DailyDevDiary workspace."
    />
  );
}
