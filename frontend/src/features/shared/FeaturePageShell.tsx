import type { LucideIcon } from "lucide-react";

type FeaturePageShellProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function FeaturePageShell({
  icon: Icon,
  title,
  description,
}: FeaturePageShellProps) {
  return (
    <section className="content feature-page" data-feature-page={title}>
      <div className="feature-page-heading">
        <span>
          <Icon aria-hidden="true" />
        </span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="feature-page-empty">
        <Icon aria-hidden="true" />
        <p>{title} is ready for its next development step.</p>
      </div>
    </section>
  );
}
