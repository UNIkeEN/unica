import { useState, useEffect, useContext } from "react"
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
import { useRouter } from "next/router";
import { ProjectLayoutTabs } from "@/layouts/project-layout";
import { Task } from "@/models/task";
import TaskContext from "@/contexts/task";
import TaskDetailProperties from "@/components/task/task-detail-properties";
import TaskDetailActivities from "@/components/task/task-detail-activities";
import TaskDetailControl from "@/components/task/task-detail-control";

const ProjectTaskDetailPage = () => {
  const [task, setTask] = useState<Task | null>(null);
  const taskCtx = useContext(TaskContext);
  const router = useRouter();

  useEffect(() => {
    const target = taskCtx.tasks.find(task => task.local_id === Number(router.query.local_id)) || null;
    if (target) setTask(target);  // TODO: get from backend, not use taskCtx(not loaded and not newest)
    else {
      // TODO: toast
      setTimeout(() => router.push(`/projects/${router.query.id}/tasks`), 1500);
    }
  }, []);

  return (
    <>
      <ProjectLayoutTabs />
      <Heading 
        as="h3" 
        size="lg" 
        wordBreak="break-all" 
        px={1}
      >
        <Editable value={task?.title} onBlur={() => {/* TODO: update task title */}}>
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