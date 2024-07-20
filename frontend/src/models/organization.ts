export interface Organization {
  id: number;
  display_name: string;
  description: string;
  created_at: string;
  updated_at: string;
  role?: string;
  member_count?: number;
  owner_count?: number;
}