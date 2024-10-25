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

const TaskDetailControl: React.FC<TaskDetailControlProps> = ({
  task,
  ...boxProps
}) => {
  const { t } = useTranslation();
  const { handleDeleteTasks } = useContext(TaskContext);
  const { isOpen: isDeleteTaskDialogOpen, onOpen: onDeleteTaskDialog, onClose: closeDeleteTaskDialog } = useDisclosure();

  const taskOperationList = [
    {
      key: "duplicate",
      icon: LuCopy,
      color: "black",
      condition: () => true, 
      onClick: () => {}
    },
    {
      key: "archive",
      icon: LuArchive,
      color: "black",
      condition: () => !task.archived, 
      onClick: () => {}
    },
    {
      key: "unarchive",
      icon: LuArchiveRestore,
      color: "black",
      condition: () => task.archived, 
      onClick: () => {}
    },
    {
      key: "delete",
      icon: LuTrash2,
      color: "red",
      condition: () => !task.deleted, 
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
              item.condition() && ( 
                <Button
                    size="sm"
                    variant="ghost"
                    color={item.color}
                    textAlign="left"
                    justifyContent="flex-start"
                    key={item.key}
                    onClick={() => item.onClick()} 
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
        onClose={closeDeleteTaskDialog}
        title={t('DeleteTaskDialog.dialog.title')}
        body={t('DeleteTaskDialog.dialog.content', { taskName: truncateString(task.title, 20) })}
        btnOK={t('DeleteTaskDialog.dialog.confirm')}
        btnCancel={t('DeleteTaskDialog.dialog.cancel')}
        onOKCallback={async () => {
          try {
            await handleDeleteTasks([task.local_id]); 
            closeDeleteTaskDialog(); 
          } catch (error) {
            console.error("Delete task failed:", error);
          }
        }}
      />
    </Box>
  );
}

export default TaskDetailControl;
