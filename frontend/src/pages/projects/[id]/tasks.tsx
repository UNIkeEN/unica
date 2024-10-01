import { useContext, useState } from "react";
import { HStack, Stack, Icon, Tooltip } from "@chakra-ui/react";
import { LuKanban, LuList, LuCalendar } from "react-icons/lu";
import { useTranslation } from 'react-i18next';
import ProjectContext from "@/contexts/project";
import { ProjectLayoutTabs } from "@/layouts/project-layout";
import SegmentedControl from "@/components/common/segmented";

const ProjectTasksPage = () => {
  const projCtx = useContext(ProjectContext);
  const { t } = useTranslation();
  const [selectedView, setSelectedView] = useState<string>("kanban")

  const viewTypeOptions = [
    {label: "kanban", value: <Icon as={LuKanban} boxSize={13}/>,tooltip: t('TaskDetailPanel.segmented.views.KanbanView')},
    {label: "list", value: <Icon as={LuList} boxSize={13}/>,tooltip: t('TaskDetailPanel.segmented.views.ListView')},
    {label: "calendar", value: <Icon as={LuCalendar} boxSize={13}/>,tooltip:t('TaskDetailPanel.segmented.views.CalendarView')},
  ]

  return (
    <>
      <Stack 
        align={{"base": "left", "md": "center"}}
        direction={{"base": "column", "md": "row"}}
        spacing={2}
      >
        <ProjectLayoutTabs />
        <HStack spacing={2} ml="auto">
          <SegmentedControl 
            selected={selectedView} 
            onSelectItem={(s) => {setSelectedView(s)}}
            size='xs'
            items={viewTypeOptions}
            withTooltip={true}
          />
        </HStack>
      </Stack>
    </>
  );
};

export default ProjectTasksPage;
