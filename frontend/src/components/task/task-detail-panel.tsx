// Task Detail Panel, can switch between modal and drawer mode
import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'next/router';
import { Task } from '@/models/task';
import TaskDetailProperties from '@/components/task/task-detail-properties';
import TaskDetailActivities from '@/components/task/task-detail-activities';
import TaskDetailControl from '@/components/task/task-detail-control';

interface TaskDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task
}

const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const [displayMode, setDisplayMode] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    setDisplayMode(
      JSON.parse(localStorage.getItem("TaskDetailPanel.displayMode")) || "modal"
    );

    if (isOpen) {
      
    }
  }, [isOpen]);

  const onDisplayModeChange = (mode: "modal" | "drawer") => {
    localStorage.setItem("TaskDetailPanel.displayMode", JSON.stringify(mode));
    setDisplayMode(mode);
  }

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
        onClose();
        if (task?.id) 
          window.open(`/projects/${router.query.id}/tasks/${task.id}`)
      },
    },
  ]

  const TaskDetailPanelHeader = () => {
    return (
      <ModalHeader wordBreak="break-all" p={0}>
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
    )
  }
  
  const TaskDetailPanelContent = () => {
    return (
      <Box m={5}>
        <Grid templateColumns="3fr 1fr" gap={8}>
          <VStack spacing={6} align="stretch">
            <TaskDetailPanelHeader />
            <TaskDetailProperties task={task}/>
            <TaskDetailActivities task={task}/>
          </VStack>
          <VStack spacing={6} align="stretch">
            <HStack spacing={6} ml="auto" mr={-2} mt={-2}>
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
            <TaskDetailControl task={task}/>
          </VStack>
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
          <TaskDetailPanelContent />
        </DrawerContent>
      </Drawer>
    )
  } else return <React.Fragment />
}

export default TaskDetailPanel;