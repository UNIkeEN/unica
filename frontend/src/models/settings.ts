export interface SettingItem {
  title: string;
  description: string;
  initialValue: string;
  component: React.ReactNode;
}

export interface SettingsSection {
  title: string;
  subtitle: string;
  items: SettingItem[];
}
