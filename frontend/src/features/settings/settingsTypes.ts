export type ThemePreference = "light" | "dark" | "system";
export type SidebarDefaultPreference = "open" | "closed";
export type EditorFontSizePreference = "small" | "medium" | "large";

export type AppPreferences = {
  theme: ThemePreference;
  sidebarDefault: SidebarDefaultPreference;
  editorFontSize: EditorFontSizePreference;
};

export const defaultPreferences: AppPreferences = {
  theme: "system",
  sidebarDefault: "open",
  editorFontSize: "medium",
};

