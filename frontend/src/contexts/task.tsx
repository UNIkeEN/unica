import React, { createContext, useState } from 'react';
import { Task } from '@/models/task';

interface TaskContextType {
  // shared state and update function in frontend
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  setTaskById: (id: number, updatedTask: Partial<Task>) => void;

  // operation function with backend
  handleCreateTask: () => void;
  handleListTasks: () => Promise<any>;
  handleGetTaskDetail: () => Promise<any>;
  handleUpdateTask: (ids: number[]) => void; 
  handleDeleteTasks: (ids: number[]) => void; // support batch operation
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  setTasks: () => {},
  setTaskById: () => {},
  handleCreateTask: () => {},
  handleListTasks: async () => null,
  handleGetTaskDetail: async () => null,
  handleUpdateTask: () => {},
  handleDeleteTasks: () => {},
});

export const TaskContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [tasks, setTasks] = useState<Task[] | undefined>([]);

  // TBD

  const setTaskById = (id: number, updatedTask: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
  };

  const contextValue = {
    tasks: tasks,
    setTasks: (tasks: Task[]) => setTasks(tasks),
    setTaskById: setTaskById,
    handleCreateTask: () => {},
    handleListTasks: async () => null,
    handleGetTaskDetail: async () => null,
    handleUpdateTask: () => {},
    handleDeleteTasks: () => {},
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  )
};

export default TaskContext;