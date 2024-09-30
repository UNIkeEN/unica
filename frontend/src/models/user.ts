export interface UserProfile {
  id: number;
  display_name: string,
  biography: string,
  email: string,
  username: string
}

export interface UserBasicInfo {
  id: number;
  display_name: string,
  biography: string,
  username: string
}

export interface UserSettings {
  title: string,
  description: string,
  initialValue: string,
  multiLines: boolean
}

export interface UserSettingsSection {
  index: number,
  title: string,
  subtitle: string,
  settings: UserSettings[]
}