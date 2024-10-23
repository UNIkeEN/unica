import React, { useState, useContext } from 'react';
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
import GenericAlertDialog from '../modals/generic-alert-dialog';
import TaskContext from '@/contexts/task';

export const taskOperationList = [
  {key: "duplicate", icon: LuCopy, color: "black", condition: (task: Task) => true},
  {key: "archive", icon: LuArchive, color: "black", condition: (task: Task) => !task.archived},
  {key: "unarchive", icon: LuArchiveRestore, color: "black", condition: (task: Task) => task.archived},
  {key: "delete", icon: LuTrash2, color: "red", condition: (task: Task) => !task.deleted}
]

interface TaskDetailControlProps extends BoxProps {
  task: Task;
}

const TaskDetailControl: React.FC<TaskDetailControlProps> = ({
  task,
  ...boxProps
}) => {
  const { t } = useTranslation();
  const { handleDeleteTasks } = useContext(TaskContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDeleteTasks([task.local_id]); // 假设使用 local_id
      setIsDialogOpen(false); // 关闭对话框
    } catch (error) {
      console.error("Delete task failed:", error);
    }
  };

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
              item.condition(task) && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  color={item.color}
                  textAlign="left" 
                  justifyContent="flex-start"
                  key={item.key}
                  onClick={item.key === "delete" ? handleDeleteClick : undefined} // 处理删除按钮点击
                >
                  <Icon as={item.icon} mr={2}/>
                  {t(`TaskDetailControl.button.${item.key}`)}
                </Button>
              )
            ))}
          </VStack>
        </VStack>

      </VStack>
      <GenericAlertDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={t('delete_task.title')}
        body={t('delete_task.content')}
        btnOK={t('confirm')}
        btnCancel={t('cancel')}
        onOKCallback={handleConfirmDelete}
      />
    </Box>
  )
}

export default TaskDetailControl;
