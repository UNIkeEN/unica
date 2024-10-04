export interface UserSettings {
  title: string;
  description: string;
  initialValue: string;
  component: React.ReactNode;
}

export interface UserSettingsSection {
  title: string;
  subtitle: string;
  settings: UserSettings[];
}
