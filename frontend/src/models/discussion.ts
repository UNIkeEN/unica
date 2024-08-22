import { UserBasicInfo } from "./user";

export interface DiscussionTopic {
  id: number;
  local_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface DiscussionComment {
  id: number;
  user: UserBasicInfo;
  local_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}