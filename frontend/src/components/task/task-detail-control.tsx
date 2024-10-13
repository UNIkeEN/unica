import {
  Box,
  BoxProps,
  Text,
  VStack,
  Button
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { Task } from '@/models/task';
import { TaskPropertyEnums } from '@/models/task';
import PropertyIcon from '@/components/property-icon';

interface TaskDetailControlProps extends BoxProps {
  task: Task;
}

const TaskDetailControl: React.FC<TaskDetailControlProps> = ({
  task,
  ...boxProps
}) => {
  const { t } = useTranslation();

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
            
          </VStack>
        </VStack>

      </VStack>
    </Box>
  )
}

export default TaskDetailControl;