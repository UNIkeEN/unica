import { useState, useContext } from 'react';
import {
  Box,
  BoxProps,
  Text,
  VStack,
  HStack,
  Flex,
  Button
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { Task } from '@/models/task';
import MarkdownEditor from '@/components/common/markdown-editor';
import MarkdownRenderer from '@/components/common/markdown-renderer';
import TaskContext from '@/contexts/task';

interface TaskDetailPropertiesProps extends BoxProps {
  task: Task;
}

const TaskDetailProperties: React.FC<TaskDetailPropertiesProps> = ({
  task,
  ...boxProps
}) => {
  const { t } = useTranslation();
  const taskCtx = useContext(TaskContext);

  const [isMdEditing, setIsMdEditing] = useState<boolean>(false);
  const [newDescValue, setNewDescValue] = useState<string>(task.description || '')

  return (
    <Box {...boxProps}>
      <VStack spacing={6} align="stretch">
        <VStack spacing={2} align="stretch">
          <Flex>
            <Text className="subtitle-bold">
              {t('TaskDetailProperties.title.description')}
            </Text>
            {!isMdEditing && <Button 
              ml="auto"
              size="sm"
              onClick={() => setIsMdEditing(true)}
            >
              {t('TaskDetailProperties.button.description.edit')}
            </Button>}
          </Flex>
          {isMdEditing 
            ? <VStack spacing={2} align="strench">
                <MarkdownEditor size="sm" content={newDescValue} onContentChange={(content) => {
                  setNewDescValue(content)
                }}/>
                <HStack spacing={2}>
                  <Button 
                    onClick={() => {
                      if (newDescValue !== task.description)
                        taskCtx.handleUpdateTask(task.id, {description: newDescValue}, false)
                      setIsMdEditing(false)
                    }}
                    size="sm"
                    colorScheme="blue"
                  >
                    {t('TaskDetailProperties.button.description.save')}
                  </Button>
                  <Button onClick={() => setIsMdEditing(false)} size="sm">
                    {t('TaskDetailProperties.button.description.cancel')}
                  </Button>
                </HStack>
              </VStack>
            : <MarkdownRenderer content={task.description}
              sx={{
                ".markdown-body": {
                  fontSize: "var(--chakra-fontSizes-sm)"
                },
              }}
            />
          }
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