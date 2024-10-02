import React, { createContext } from 'react';

interface TaskContextType {
  handleCreateTask: () => void;
  handleListTasks: () => Promise<any>;
  handleGetTaskDetail: () => Promise<any>;
  handleUpdateTask: (ids: number[]) => void; 
  handleDeleteTasks: (ids: number[]) => void; // support batch operation
}

const TaskContext = createContext<TaskContextType>({
  handleCreateTask: () => {},
  handleListTasks: async () => null,
  handleGetTaskDetail: async () => null,
  handleUpdateTask: () => {},
  handleDeleteTasks: () => {},
});

export const TaskContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // TBD

  const contextValue = {
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