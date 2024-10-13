import React, { useContext } from 'react';
import Head from 'next/head';
import { 
  Box, 
  HStack, 
  VStack 
} from '@chakra-ui/react';
import TaskCard from '@/components/task/task-card';
import TaskContext from '@/contexts/task';
import { Task } from '@/models/task';

interface KanbanColumnProps {
  header?: React.ReactNode;
  tasks: Task[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  header,
  tasks = []
}) => {
  return (
    <VStack spacing={3}>
      {header && <Box mb={2}>{header}</Box>}
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </VStack>
  )
}

const TasksKanbanView: React.FC = () => {
  const { tasks } = useContext(TaskContext)

  const group = ["TEST"];  // TBD

  return (
    <>
      <Head>
        <meta name="pageBgColor" content="#F7FAFC" />
      </Head>
      <HStack spacing={6}>
        {group.map((group) => (
          <KanbanColumn tasks={tasks} key={group}/>
        ))}
      </HStack>
    </>
  )
}

export default TasksKanbanView