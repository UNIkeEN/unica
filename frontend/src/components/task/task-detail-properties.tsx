import { useState } from 'react';
import {
  Box,
  BoxProps,
  Text,
  VStack
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { Task } from '@/models/task';
import MarkdownEditor from '@/components/common/markdown-editor';
import MarkdownRenderer from '@/components/common/markdown-renderer';

interface TaskDetailPropertiesProps extends BoxProps {
  task: Task;
}

const TaskDetailProperties: React.FC<TaskDetailPropertiesProps> = ({
  task,
  ...boxProps
}) => {
  const { t } = useTranslation();

  const [isMdEditing, setIsMdEditing] = useState<boolean>(false);

  return (
    <Box {...boxProps}>
      <VStack spacing={6} align="stretch">
        <VStack spacing={2} align="stretch">
          <Text className="subtitle-bold">
            {t('TaskDetailProperties.title.description')}
          </Text>
          {task?.description && (isMdEditing 
            ? <MarkdownEditor content={task.description} onContentChange={() => {/* TODO */}}/> 
            : <MarkdownRenderer content={task.description}/>
          )}
        </VStack>

        <VStack spacing={2} align="stretch">
          <Text className="subtitle-bold">
            {t('TaskDetailProperties.title.global-properties')}
          </Text>
        </VStack>

        <VStack spacing={2} align="stretch">
          <Text className="subtitle-bold">
            {t('TaskDetailProperties.title.local-properties')}
          </Text>
        </VStack>
      </VStack>
    </Box>
  )
}

export default TaskDetailProperties;