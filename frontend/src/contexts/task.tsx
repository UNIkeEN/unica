import React, { createContext, useState, useEffect } from 'react';
import { Task, MockTask } from '@/models/task';

interface TaskContextType {
  // shared state and update function in frontend
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  setTaskById: (id: number, updatedValue: Partial<Task>) => void;
  setTaskByLocalId: (localId: number, updatedValue: Partial<Task>) => void;

  // operation function with backend
  handleCreateTask: () => void;
  handleListTasks: () => Promise<any>;
  handleGetTaskDetail: () => Promise<any>;
  handleUpdateTask: (localId: number, updatedValue: Partial<Task>) => void; 
  handleDeleteTasks: (localIds: number[]) => void; // support batch operation
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  setTasks: () => {},
  setTaskById: () => {},
  setTaskByLocalId: () => {},
  handleCreateTask: () => {},
  handleListTasks: async () => null,
  handleGetTaskDetail: async () => null,
  handleUpdateTask: () => {},
  handleDeleteTasks: () => {}
});

export const TaskContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [tasks, setTasks] = useState<Task[] | undefined>([]);

  // TBD
  useEffect(() => {
    setTasks([MockTask, MockTask])
  }, []);

  const setTaskById = (id: number, updatedValue: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updatedValue} : task
      ));
  };

  const setTaskByLocalId = (localId: number, updatedValue: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.local_id === localId ? { ...task, ...updatedValue } : task
      ));
  };

  const contextValue = {
    tasks: tasks,
    setTasks: (tasks: Task[]) => setTasks(tasks),
    setTaskById: setTaskById,
    setTaskByLocalId: setTaskByLocalId,
    handleCreateTask: () => {},
    handleListTasks: async () => null,
    handleGetTaskDetail: async () => null,
    handleUpdateTask: () => {},
    handleDeleteTasks: () => {}
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  )
};

export default TaskContext;