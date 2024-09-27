export interface TaskSummary {
  title: string;
  description: string;
  local_id: number;
  // TBD
}

export interface TaskDetail {
  title: string;
  description: string;
  local_id: number;
  created_at: string;
  updated_at: string;
  archived: boolean;
  // TBD
}

export const MockTaskSummary: TaskSummary = {
  title: "Mock Task",
  description: "Mock Desc",
  local_id: 1,
};