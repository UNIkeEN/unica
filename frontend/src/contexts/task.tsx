import React, { createContext, useState, useEffect, useContext } from 'react';
import { Task, MockTask, MockTask2, EditableTaskField } from '@/models/task';
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
  handleCreateTask: (task: Partial<EditableTaskField>) => Promise<any>;
  handleListTasks: () => Promise<any>;  // list all, without pagination
  handleGetTaskDetail: () => Promise<any>;
  handleUpdateTask: (localId: number, updatedValue: Partial<EditableTaskField>, toastOnSuccess: boolean) => Promise<any>; 
  handleDeleteTasks: (localIds: number[]) => Promise<any>; // support batch operation
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  setTasks: () => {},
  setTaskById: () => {},
  setTaskByLocalId: () => {},

  handleCreateTask: () => null,
  handleListTasks: async () => null,
  handleGetTaskDetail: async () => null,
  handleUpdateTask: () => null,
  handleDeleteTasks: () => null,
});

export const TaskContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const projCtx = useContext(ProjectContext);
  const toast = useToast();
  const { t } = useTranslation();
  const router = useRouter();
  const proj_id = Number(router.query.id);

  const [tasks, setTasks] = useState<Task[] | undefined>([]);

  useEffect(() => {
    handleListTasks()
    .then((res) => setTasks(res))
    .catch((error) => setTasks([]))
  }, [proj_id]);

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

  const handleCreateTask = async (value: Partial<EditableTaskField>) => {
    if (!proj_id) return null;
    try {
      const res = await createTask(proj_id, value);
      setTasks((prevTasks) => [res as Task, ...prevTasks]);
      toast({
        title: t('Services.task.createTask.created', { title: value.title.length > 20 ? value.title.slice(0, 20) + '...' : value.title }),
        status: 'success'
      })
      return res;
    } catch (error) {
      if (error.request && error.request.status === 403) {
        projCtx.toastNoPermissionAndRedirect();
      } else toast({
        title: t('Services.task.createTask.error'),
        status: 'error'
      })
      return null;
    }
  };

  const handleListTasks = async () => {
    if (!proj_id) return [];
    try {
      const res = await listTasks(proj_id);
      return res;
    } catch (error) {
      if (error.request && error.request.status === 403) {
        projCtx.toastNoPermissionAndRedirect();
      } else toast({
        title: t('Services.task.listTask.error'),
        status: 'error'
      })
      return null;
    }
  };

  const handleUpdateTask = async (localId: number, updatedValue: Partial<EditableTaskField>, toastOnSuccess: boolean) => {
    if (!proj_id) return null;
    try {
      const res = await updateTask(proj_id, localId, updatedValue);
      setTaskByLocalId(localId, updatedValue);
      if (toastOnSuccess) {
        toast({
          title: t('Services.task.updateTask.success'),
          status: 'success'
        })
      }
      return res;
    } catch (error) {
      if (error.request && error.request.status === 403) {
        projCtx.toastNoPermissionAndRedirect();
      } else toast({
        title: t('Services.task.updateTask.error'),
        status: 'error'
      })
      return null;
    }
  };

  const handleDeleteTasks = async (localIds: number[]) => {
    if (!proj_id) return null;
    try {
      const res = await deleteTasks(proj_id, localIds);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => !localIds.includes(task.local_id))
      );
      toast({
        title: t('Services.task.deleteTasks.success'),
        status: 'success'
      })
      return res;
    } catch (error) {
      if (error.request && error.request.status === 403) {
        projCtx.toastNoPermissionAndRedirect();
      } else toast({
        title: t('Services.task.deleteTasks.error'),
        status: 'error'
      })
      return null;
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