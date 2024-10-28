import React, { useContext } from 'react';
import {
  Box,
  BoxProps,
  Text,
  VStack,
  Button,
  Icon
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { 
  LuTrash2,
  LuArchive,
  LuArchiveRestore,
  LuCopy
} from "react-icons/lu";
import { Task } from '@/models/task';
import { TaskPropertyEnums } from '@/models/task';
import PropertyIcon from '@/components/property-icon';
import GenericConfirmDialog from '@/components/modals/generic-confirm-dialog';
import TaskContext from '@/contexts/task';
import { useDisclosure } from '@chakra-ui/react';
import { truncateString } from '@/utils/string';

interface TaskDetailControlProps extends BoxProps {
  task: Task;
}

const TaskDetailControl: React.FC<TaskDetailControlProps> = ({
  task,
  ...boxProps
}) => {
  const { t } = useTranslation();

  const { tasks, setTasks, handleDeleteTasks, handleUpdateTask } = useContext(TaskContext);

  const { 
    isOpen: isDeleteTaskDialogOpen, 
    onOpen: onDeleteTaskDialog, 
    onClose: onDeleteTaskDialogClose 
  } = useDisclosure();

  const { 
    isOpen: isArchiveDialogOpen, 
    onOpen: onArchiveDialogOpen, 
    onClose: onArchiveDialogClose 
  } = useDisclosure();

  const { 
    isOpen: isUnarchiveDialogOpen, 
    onOpen: onUnarchiveDialogOpen, 
    onClose: onUnarchiveDialogClose 
  } = useDisclosure();

  const taskOperationList = [
    {
      key: "duplicate",
      icon: LuCopy,
      color: "black",
      condition: true, 
      onClick: () => {}
    },
    {
      key: "archive",
      icon: LuArchive,
      color: "black",
      condition: !task.archived, 
      onClick: () => onArchiveDialogOpen()
    },
    {
      key: "unarchive",
      icon: LuArchiveRestore,
      color: "black",
      condition: task.archived, 
      onClick: () =>  onUnarchiveDialogOpen()
    },
    {
      key: "delete",
      icon: LuTrash2,
      color: "red",
      condition: !task.deleted, 
      onClick: () => onDeleteTaskDialog()
    }
  ];

  return (
    <Box {...boxProps}>
      <VStack spacing={6} align="stretch">
        <VStack spacing={2} align="stretch">
          <Text fontSize="sm" className="secondary-text" ml={3}>
            {t("TaskDetailControl.title.local-properties")}
          </Text>
          <VStack spacing={0.5} align="stretch">
            {TaskPropertyEnums.map((item) => (
              <Button 
                size="sm" 
                variant="ghost" 
                textAlign="left" 
                justifyContent="flex-start"
                key={item}
              >
                <PropertyIcon type={item} mr={2}/>
                {t(`Enums.properties.${item}`)}
              </Button>
            ))}
          </VStack>
        </VStack>

        <VStack spacing={2} align="stretch">
          <Text fontSize="sm" className="secondary-text" ml={3}>
            {t("TaskDetailControl.title.operation")}
          </Text>
          <VStack spacing={0.5} align="stretch">
            {taskOperationList.map((item) => (
              item.condition && ( 
                <Button
                    size="sm"
                    variant="ghost"
                    color={item.color}
                    textAlign="left"
                    justifyContent="flex-start"
                    key={item.key}
                    onClick={item.onClick} 
                >
                    <Icon as={item.icon} mr={2} />
                    {t(`TaskDetailControl.button.${item.key}`)}
                </Button>
              )
            ))}
          </VStack>
        </VStack>
      </VStack>

      <GenericConfirmDialog
        isOpen={isDeleteTaskDialogOpen}
        onClose={onDeleteTaskDialogClose}
        title={t('DeleteTaskDialog.dialog.title')}
        body={t('DeleteTaskDialog.dialog.content', { taskName: truncateString(task.title, 20) })}
        btnOK={t('DeleteTaskDialog.dialog.confirm')}
        btnCancel={t('DeleteTaskDialog.dialog.cancel')}
        onOKCallback={async () => {
          const res = await handleDeleteTasks([task.local_id]); 
          if (res) onDeleteTaskDialogClose(); 
        }}
      />

      <GenericConfirmDialog
        isOpen={isArchiveDialogOpen}
        onClose={onArchiveDialogClose}
        title={t('ArchiveTaskDialog.dialog.title')}
        body={t('ArchiveTaskDialog.dialog.content', { taskName: truncateString(task.title, 20) })}
        btnOK={t('ArchiveTaskDialog.dialog.confirm')}
        btnCancel={t('ArchiveTaskDialog.dialog.cancel')}
        onOKCallback={async () => {
          const res = await handleUpdateTask(task.local_id, { archived: true }, true);
          if (res) {
            onArchiveDialogClose();
            setTasks(tasks.filter((t) => t.local_id !== task.local_id));
          }
        }}
        isAlert={false}
      />

      <GenericConfirmDialog
        isOpen={isUnarchiveDialogOpen}
        onClose={onArchiveDialogClose}
        title={t('UnarchiveTaskDialog.dialog.title')}
        body={t('UnarchiveTaskDialog.dialog.content', { taskName: truncateString(task.title, 20) })}
        btnOK={t('UnarchiveTaskDialog.dialog.confirm')}
        btnCancel={t('UnarchiveTaskDialog.dialog.cancel')}
        onOKCallback={async () => {
          const res = await handleUpdateTask(task.local_id, { archived: false }, true);
          if (res) {
            onUnarchiveDialogClose();
            setTasks([...tasks, task]);
          }
        }}
        isAlert={false} 
      />

      

      <GenericConfirmDialog
        isOpen={isArchiveDialogOpen}
        onClose={onArchiveDialogClose}
        title={t('ArchiveTaskDialog.dialog.title')}
        body={t('ArchiveTaskDialog.dialog.content', { taskName: truncateString(task.title, 20) })}
        btnOK={t('ArchiveTaskDialog.dialog.confirm')}
        btnCancel={t('ArchiveTaskDialog.dialog.cancel')}
        onOKCallback={async () => {
          await handleUpdateTask(task.local_id, { archived: true }, true);
          onArchiveDialogClose();
        }}
        isAlert={false}
      />

      <GenericConfirmDialog
        isOpen={isUnarchiveDialogOpen}
        onClose={onArchiveDialogClose}
        title={t('UnarchiveTaskDialog.dialog.title')}
        body={t('UnarchiveTaskDialog.dialog.content', { taskName: truncateString(task.title, 20) })}
        btnOK={t('UnarchiveTaskDialog.dialog.confirm')}
        btnCancel={t('UnarchiveTaskDialog.dialog.cancel')}
        onOKCallback={async () => {
          await handleUpdateTask(task.local_id, { archived: false }, true);
          onUnarchiveDialogClose();
        }}
        isAlert={false} 
      />

      
    </Box>
  );
}

export default TaskDetailControl;
