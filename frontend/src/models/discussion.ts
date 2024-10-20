import { UserBasicInfo } from "./user";
import { ColorSelectorType } from "./enums";

export interface DiscussionTopic {
  id: number;
  title: string;
  category: DiscussionTopicCategory;
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
  deleted: boolean;
}

export interface DiscussionTopicCategory {
  id: number;
  name: string;
  color: ColorSelectorType;
  emoji?: string;
  description?: string;
}

export const emptyCategory: DiscussionTopicCategory = {
  id: 0,
  name: '',
  color: 'gray',
  emoji: '',
  description: ''
};