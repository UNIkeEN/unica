import {
  Box,
  BoxProps,
  VStack,
  Text,
  HStack,
  Tooltip
} from '@chakra-ui/react'
import { LuText } from "react-icons/lu";
import { Task } from '@/models/task'

interface TaskCardProps extends BoxProps {
  task: Task
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
      w='xs'
      p={2.5}
      borderWidth='1px'
      borderRadius='lg'
      bgColor='white'
      _hover={{
        borderColor: 'blue.400',
        outline: '1px solid',
        outlineColor: 'blue.400'
      }}
      cursor="pointer"
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