import { UserBasicInfo } from "./user";

export interface Organization {
  id: number;
  display_name: string;
  description: string;
  created_at: string;
  updated_at: string;
  role?: string;
  member_count?: number;
  owner_count?: number;
  project_count?: number;
  is_discussion_enabled?: boolean;
}

export interface OrganizationMember {
  user: UserBasicInfo;
  role: string;
  joined_at: string;
}

export const MemberRoleEnum = {
  OWNER: "Owner",
  MEMBER: "Member",
  PENDING: "Pending",
  NO_PERMISSION: "No Permission",
};