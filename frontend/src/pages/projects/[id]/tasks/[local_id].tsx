import { useState } from "react"
import {
  Grid,
  VStack,
  Text,
  Heading,
  Editable,
  EditableInput,
  EditablePreview,
  Show,
  Hide
} from "@chakra-ui/react";
import Head from 'next/head';
import { Task, MockTask } from "@/models/task";
import TaskDetailProperties from "@/components/task/task-detail-properties";
import TaskDetailActivities from "@/components/task/task-detail-activities";
import TaskDetailControl from "@/components/task/task-detail-control";

const ProjectTaskDetailPage = () => {
  const [task, setTask] = useState<Task | null>(MockTask);

  return (
    <>
      <Heading 
        as="h3" 
        size="lg" 
        wordBreak="break-all" 
        px={1}
      >
        <Editable defaultValue={task?.title} onBlur={() => {/* TODO: update task title */}}>
          <EditablePreview />
          <EditableInput w="80%"/>
          <Text
            as="span"
            fontWeight="normal"
            color="gray.400"
            ml={2}
          >
            {`#${task?.local_id}`}
          </Text>
        </Editable>
      </Heading>
      <Show above="xl">
        <Grid templateColumns="3fr 2fr 1fr" gap={6}>
          <TaskDetailProperties task={task}/>
          <TaskDetailActivities task={task}/>
          <TaskDetailControl task={task}/>
        </Grid>
      </Show>
      <Hide above="xl">
        <Grid templateColumns="3fr 1fr" gap={6}>
          <VStack spacing={6} align="stretch">
            <TaskDetailProperties task={task}/>
            <TaskDetailActivities task={task}/>
          </VStack>
          <TaskDetailControl task={task}/>
        </Grid>
      </Hide>
    </>
  )
}

export default ProjectTaskDetailPage