import { useState } from "react";
import { 
  HStack,
  Stack,
  Icon
} from "@chakra-ui/react";
import { LuKanban, LuList, LuCalendar } from "react-icons/lu";
import { useTranslation } from 'react-i18next';
import { ProjectLayoutTabs } from "@/layouts/project-layout";
import SegmentedControl from "@/components/common/segmented";
import TasksKanbanView from "@/components/task/tasks-kanban-view";
import CreateTaskModal from "@/components/modals/create-task-modal";

const ProjectTasksPage = () => {
  const { t } = useTranslation();
  const [selectedView, setSelectedView] = useState<string>("kanban");

  const viewTypes = [
    { 
      label: "kanban", 
      icon: LuKanban,
      view: <TasksKanbanView />
    },
    { 
      label: "list", 
      icon: LuList,
      view: <></> // TBD
    },
    { 
      label: "calendar", 
      icon: LuCalendar,
      view: <></> // TBD
    }
  ]

  return (
    <>
      <Stack
        align={{ "base": "left", "md": "center" }}
        direction={{ "base": "column", "md": "row" }}
        spacing={2}
      >
        <ProjectLayoutTabs />
        <HStack spacing={3} ml="auto">
          <SegmentedControl
            selected={selectedView}
            onSelectItem={(s) => { setSelectedView(s) }}
            size='xs'
            items={viewTypes.map(item => ({
              ...item,
              value: <Icon as={item.icon} boxSize={13}/>,
              tooltip: t(`ProjectPages.tasks.segmented.views.${item.label}`)
            }))}
            withTooltip={true}
          />

          <CreateTaskModal />
        </HStack>
      </Stack>

      {viewTypes.find(item => item.label === selectedView)?.view}
    </>
  );
};

export default ProjectTasksPage;
