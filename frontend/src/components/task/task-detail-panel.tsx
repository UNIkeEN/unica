// Task Detail Panel, can switch between modal and drawer mode
import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  CloseButton,
  IconButton,
  Flex,
  HStack,
  Editable,
  EditablePreview,
  EditableInput,
  Text,
  Box,
  Grid,
  VStack
} from '@chakra-ui/react';
import { LuSquareDot, LuExternalLink, LuPanelRight } from "react-icons/lu";
import { Task, MockTask } from '@/models/task';
import TaskDetailProperties from '@/components/task/task-detail-properties';
import TaskDetailActivities from '@/components/task/task-detail-activities';
import TaskDetailControl from '@/components/task/task-detail-control';
import ProjectContext from '@/contexts/project';

interface TaskDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const [task, setTask] = useState<Task | null>(null);
  const [displayMode, setDisplayMode] = useState<string>("");
  const projCtx = useContext(ProjectContext);

  useEffect(() => {
    setDisplayMode(
      JSON.parse(localStorage.getItem("TaskDetailPanel.displayMode")) || "modal"
    );

    if (isOpen) {
      // TODO: fetch task detail
      setTask(MockTask as Task);
    }
  }, [isOpen]);

  const onDisplayModeChange = (mode: "modal" | "drawer") => {
    localStorage.setItem("TaskDetailPanel.displayMode", JSON.stringify(mode));
    setDisplayMode(mode);
  }

  const TaskDetailPanelHeader = () => {
    const modeBtnList = [
      {
        label: "modal",
        icon: <LuSquareDot />,
        onClick: () => onDisplayModeChange("modal"),
      },
      {
        label: "drawer",
        icon: <LuPanelRight />,
        onClick: () => onDisplayModeChange("drawer"),
      },
      {
        label: "external",
        icon: <LuExternalLink />,
        onClick: () => {
          if (task?.id) 
            window.open(`/projects/${projCtx.basicInfo.id}/tasks/${task.id}`)
        },
      },
    ]

    return (
      <Flex alignItems="flex-start">
        <ModalHeader flex="1">
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
        </ModalHeader>
        <HStack spacing={6} ml="auto" mt={3} mr={3}>
          <HStack spacing={1}>
            {modeBtnList.map(mode => (
              <IconButton 
                key={mode.label} 
                aria-label={mode.label}
                icon={mode.icon} 
                variant="ghost" 
                size="sm"
                fontSize="15px"
                onClick={mode.onClick}
                isActive={displayMode === mode.label}
              />
            ))}
          </HStack>
          <CloseButton onClick={onClose}/>
        </HStack>
      </Flex>
    )
  }
  
  const TaskDetailPanelContent = () => {
    return (
      <Box mx={6} mb={6}>
        <Grid templateColumns="3fr 1fr" gap={6}>
          <VStack spacing={6} align="stretch">
            <TaskDetailProperties task={task}/>
            <TaskDetailActivities task={task}/>
          </VStack>
          <TaskDetailControl task={task}/>
        </Grid>
      </Box>
    )
  }

  if (displayMode === "modal") {
    return (
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        isCentered
        size={{base: "2xl", lg: "3xl"}}
        autoFocus={false}
      >
        <ModalOverlay />
        <ModalContent>
          <TaskDetailPanelHeader />
          <TaskDetailPanelContent />
        </ModalContent>
      </Modal>
    )
  } else if (displayMode === "drawer") {
    return (
      <Drawer 
        isOpen={isOpen} 
        onClose={onClose}
        size={{base: "lg", xl: "xl"}}
        autoFocus={false}
      >
        <DrawerOverlay />
        <DrawerContent>
          <TaskDetailPanelHeader />
          <TaskDetailPanelContent />
        </DrawerContent>
      </Drawer>
    )
  } else return <React.Fragment />
}

export default TaskDetailPanel;