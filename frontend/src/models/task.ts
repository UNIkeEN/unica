export interface Task {
  id: number;
  title: string;
  description: string;
  local_id: number;
  created_at: string;
  updated_at: string;
  archived: boolean;
  // TBD
}

export const TaskPropertyEnums = [
  "text",
  "number",
  "label",
  "group",
  "datetime",
  "user"
] as const;

export const MockTask: Task = {
  id: 1,
  title: "Mock Task",
  description: "Mock Desc",
  local_id: 1,
  created_at: null,
  updated_at: null,
  archived: false
};

export const MockTask2: Task = {
  id: 2,
  title: "Mock Task 2",
  description: "",
  local_id: 2,
  created_at: null,
  updated_at: null,
  archived: false
};