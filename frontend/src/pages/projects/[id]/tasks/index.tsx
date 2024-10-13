import { useContext, useState } from "react";
import { HStack, Stack, Icon, Box } from "@chakra-ui/react";
import { LuKanban, LuList, LuCalendar } from "react-icons/lu";
import { useTranslation } from 'react-i18next';
import ProjectContext from "@/contexts/project";
import { ProjectLayoutTabs } from "@/layouts/project-layout";
import SegmentedControl from "@/components/common/segmented";
import TasksKanbanView from "@/components/task/tasks-kanban-view";

const ProjectTasksPage = () => {
  const projCtx = useContext(ProjectContext);
  const { t } = useTranslation();
  const [selectedView, setSelectedView] = useState<string>("kanban")

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
        <HStack spacing={2} ml="auto">
          <SegmentedControl
            selected={selectedView}
            onSelectItem={(s) => { setSelectedView(s) }}
            size='xs'
            items={viewTypes.map(item => ({
              ...item,
              value: <Icon as={item.icon} boxSize={13}/>,
              tooltip: t(`TaskDetailPanel.segmented.views.${item.label}`)
            }))}
            withTooltip={true}
          />
        </HStack>
      </Stack>

      {viewTypes.find(item => item.label === selectedView)?.view}
    </>
  );
};

export default ProjectTasksPage;
