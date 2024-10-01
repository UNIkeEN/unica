export interface TaskSummary {
  id: number;
  title: string;
  description: string;
  local_id: number;
  // TBD
}

export interface TaskDetail {
  id: number;
  title: string;
  description: string;
  local_id: number;
  created_at: string;
  updated_at: string;
  archived: boolean;
  // TBD
}

export const MockTaskSummary: TaskSummary = {
  id: 1,
  title: "Mock Task",
  description: "Mock Desc",
  local_id: 1,
};