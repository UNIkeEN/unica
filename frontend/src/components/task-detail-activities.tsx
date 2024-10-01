import {
  Box,
  BoxProps,
  Heading,
  Text,
  VStack
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { TaskDetail } from '@/models/task';

interface TaskDetailActivitiesProps extends BoxProps {
  task: TaskDetail;
}

const TaskDetailActivities: React.FC<TaskDetailActivitiesProps> = ({
  task,
  ...boxProps
}) => {
  const { t } = useTranslation();

  return (
    <Box {...boxProps}>
      <VStack spacing={2} align="stretch">
        <Text className="subtitle">
          {t('TaskDetailActivities.title.activities')}
        </Text>
      </VStack>
    </Box>
  )
}

export default TaskDetailActivities;