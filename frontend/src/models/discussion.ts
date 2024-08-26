import { UserBasicInfo } from "./user";

export interface DiscussionTopic {
  id: number;
  title: string;
  local_id: number;
  created_at: string;
  updated_at: string;
  user: UserBasicInfo;
}

export interface DiscussionComment {
  id: number;
  user: UserBasicInfo;
  topic: number;
  content: string;
  created_at: string;
  updated_at: string;
  local_id: number;
  edited: boolean;
}