import React, { createContext } from 'react';

interface TaskContextType {
  handleCreateTask: () => void;
  handleListTasks: () => Promise<any>;
  handleGetTaskDetail: () => Promise<any>;
  handleUpdateTasks: (ids: number[]) => void; // support batch operation
  handleDeleteTasks: (ids: number[]) => void;
}

const TaskContext = createContext<TaskContextType>({
  handleCreateTask: () => {},
  handleListTasks: async () => null,
  handleGetTaskDetail: async () => null,
  handleUpdateTasks: () => {},
  handleDeleteTasks: () => {},
});

export const TaskContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // TBD

  const contextValue = {
    handleCreateTask: () => {},
    handleListTasks: async () => null,
    handleGetTaskDetail: async () => null,
    handleUpdateTasks: () => {},
    handleDeleteTasks: () => {},
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  )
};

export default TaskContext;