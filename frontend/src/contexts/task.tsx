import React, { createContext, useState, useEffect, useContext } from 'react';
import { Task, MockTask, MockTask2, EditableTask } from '@/models/task';
import { createTask, deleteTasks, listTasks, updateTask } from '@/services/task';
import { useRouter } from 'next/router';
import { useToast } from '@/contexts/toast';
import ProjectContext from '@/contexts/project';
import { useTranslation } from 'react-i18next';

interface TaskContextType {
  // shared state and update function in frontend
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  setTaskById: (id: number, updatedValue: Partial<Task>) => void;
  setTaskByLocalId: (localId: number, updatedValue: Partial<Task>) => void;

  // operation function with backend
  handleCreateTask: (pro_id: number, task: Partial<EditableTask>) => void;
  handleListTasks: (pro_id: number, page: number, pageSize: number) => Promise<any>;
  handleGetTaskDetail: () => Promise<any>;
  handleUpdateTask: (pro_id: number, localId: number, updatedValue: Partial<EditableTask>) => void; 
  handleDeleteTasks: (pro_id: number, localIds: number[]) => void; // support batch operation
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
  handleDeleteTasks: () => { },
});

export const TaskContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const projCtx = useContext(ProjectContext);
  const toast = useToast();
  const { t } = useTranslation();

  const [tasks, setTasks] = useState<Task[] | undefined>([]);

  // TBD
  useEffect(() => {
    setTasks([MockTask, MockTask2])
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

  const handleCreateTask = async (pro_id: number, value: Partial<EditableTask>) => {
    if (!pro_id) return;
    try {
      await createTask(pro_id, value);
      setTasks((prevTasks) => [...prevTasks, value as Task]);
    } catch (error) {
      if (error.request && error.request.status === 403) {
        projCtx.toastNoPermissionAndRedirect();
      } else toast({
        title: t('Services.task.createTask.error'),
        status: 'error'
      })
    }
  };

  const handleListTasks = async (pro_id: number, page: number, pageSize: number) => {
    if (!pro_id) return null;
    try {
      const res = await listTasks(pro_id, page, pageSize);
      return res.results;
    } catch (error) {
      if (error.request && error.request.status === 403) {
        projCtx.toastNoPermissionAndRedirect();
      } else toast({
        title: t('Services.task.listTask.error'),
        status: 'error'
      })
    }
  };

  const handleUpdateTask = async (pro_id: number, localId: number, updatedValue: Partial<EditableTask>) => {
    if (!pro_id) return;
    try {
      await updateTask(pro_id, localId, updatedValue);
      setTaskByLocalId(localId, updatedValue);
    } catch (error) {
      if (error.request && error.request.status === 403) {
        projCtx.toastNoPermissionAndRedirect();
      } else toast({
        title: t('Services.task.updateTask.error'),
        status: 'error'
      })
    }
  };

  const handleDeleteTasks = async (pro_id: number, localIds: number[]) => {
    if (!pro_id) return;
    try {
      await deleteTasks(pro_id, localIds);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => !localIds.includes(task.local_id))
      );
    } catch (error) {
      if (error.request && error.request.status === 403) {
        projCtx.toastNoPermissionAndRedirect();
      } else toast({
        title: t('Services.task.deleteTasks.error'),
        status: 'error'
      })
    }
  };

  

  const contextValue = {
    tasks: tasks,
    setTasks: (tasks: Task[]) => setTasks(tasks),
    setTaskById: setTaskById,
    setTaskByLocalId: setTaskByLocalId,

    handleCreateTask: handleCreateTask,
    handleListTasks: handleListTasks,
    handleGetTaskDetail: async () => null,
    handleUpdateTask: handleUpdateTask,
    handleDeleteTasks: handleDeleteTasks
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  )
};

export default TaskContext;