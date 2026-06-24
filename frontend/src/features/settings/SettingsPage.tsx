import { Monitor, PanelLeft, Settings, Type } from "lucide-react";
import type { ReactNode } from "react";
import type {
  AppPreferences,
  EditorFontSizePreference,
  SidebarDefaultPreference,
  ThemePreference,
} from "./settingsTypes";

type SettingsPageProps = {
  preferences: AppPreferences;
  onChange: (preferences: AppPreferences) => void;
};

const themeOptions: Array<{ value: ThemePreference; label: string }> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const sidebarOptions: Array<{ value: SidebarDefaultPreference; label: string }> = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
];

const editorFontOptions: Array<{ value: EditorFontSizePreference; label: string }> = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export function SettingsPage({ preferences, onChange }: SettingsPageProps) {
  return (
    <section className="content feature-page settings-page" data-feature-page="Settings">
      <div className="feature-page-heading">
        <span>
          <Settings aria-hidden="true" />
        </span>
        <div>
          <h2>Settings</h2>
          <p>Customize your workspace preferences.</p>
        </div>
      </div>

      <div className="settings-grid">
        <PreferenceCard
          icon={Monitor}
          title="Theme"
          description="Choose how DailyDevDiary should look."
        >
          <SegmentedControl
            label="Theme"
            options={themeOptions}
            value={preferences.theme}
            onChange={(theme) => onChange({ ...preferences, theme })}
          />
        </PreferenceCard>

        <PreferenceCard
          icon={PanelLeft}
          title="Sidebar default"
          description="Choose whether the sidebar starts open or closed."
        >
          <SegmentedControl
            label="Sidebar default"
            options={sidebarOptions}
            value={preferences.sidebarDefault}
            onChange={(sidebarDefault) => onChange({ ...preferences, sidebarDefault })}
          />
        </PreferenceCard>

        <PreferenceCard
          icon={Type}
          title="Editor font size"
          description="Adjust the writing area to match your reading comfort."
        >
          <SegmentedControl
            label="Editor font size"
            options={editorFontOptions}
            value={preferences.editorFontSize}
            onChange={(editorFontSize) => onChange({ ...preferences, editorFontSize })}
          />
        </PreferenceCard>
      </div>
    </section>
  );
}

type PreferenceCardProps = {
  icon: typeof Settings;
  title: string;
  description: string;
  children: ReactNode;
};

function PreferenceCard({ icon: Icon, title, description, children }: PreferenceCardProps) {
  return (
    <article className="settings-card">
      <div className="settings-card-copy">
        <span>
          <Icon aria-hidden="true" />
        </span>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </article>
  );
}

type SegmentedControlProps<T extends string> = {
  label: string;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
};

function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="segmented-control" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          className={option.value === value ? "selected" : ""}
          type="button"
          key={option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
