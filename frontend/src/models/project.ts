export interface Project {
  id: number;
  display_name: string;
  description: string;
  created_at: string;
  updated_at: string;
  owner_type: string;
  owner?: {id: number, display_name: string}; // exist only if owner_type is 'Organization'
}

export const ProjectOwnerTypeEnum = {
  USER: "User",
  ORGANIZATION: "Organization"
};