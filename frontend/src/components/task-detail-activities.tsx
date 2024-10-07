import {
  Box,
  BoxProps,
  Text,
  VStack
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { Task } from '@/models/task';

interface TaskDetailActivitiesProps extends BoxProps {
  task: Task;
}

const TaskDetailActivities: React.FC<TaskDetailActivitiesProps> = ({
  task,
  ...boxProps
}) => {
  const { t } = useTranslation();

  return (
    <Box {...boxProps}>
      <VStack spacing={2} align="stretch">
        <Text className="subtitle-bold">
          {t('TaskDetailActivities.title.activities')}
        </Text>
      </VStack>
    </Box>
  )
}

export default TaskDetailActivities;