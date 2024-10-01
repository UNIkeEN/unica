import {
  Box,
  BoxProps,
  VStack,
  Text,
  HStack
} from '@chakra-ui/react'
import { LuText } from "react-icons/lu";
import { TaskSummary } from '@/models/task'

interface TaskCardProps extends BoxProps {
  task: TaskSummary
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  ...boxProps
}) => {

  const cardBodyItems = [
    {
      condition: task.description,
      content: <LuText/>
    }
  ]
  
  return (
    <Box 
      w='sm'
      p={2.5}
      borderWidth='1px'
      borderRadius='lg'
      {...boxProps}
    >
      <VStack spacing={0} align='left'>
        <Text fontSize='xs' color='gray.400'>{`#${task.local_id}`}</Text>
        <Text fontSize='md'>{task.title}</Text>
        {cardBodyItems.some(item => item.condition) && (
          <HStack spacing={1} mt={2} color='gray.600'>
            {cardBodyItems.map(item => {
              if (item.condition) return item.content
            })}
          </HStack>
        )}
      </VStack>
    </Box>
  )
}

export default TaskCard