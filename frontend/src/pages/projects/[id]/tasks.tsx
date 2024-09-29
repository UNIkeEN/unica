import { useContext, useState } from "react";
import { VStack, Stack } from "@chakra-ui/react";
import { LuKanban, LuList, LuCalendar } from "react-icons/lu";
import { useTranslation } from 'react-i18next';
import ProjectContext from "@/contexts/project";
import { ProjectLayoutTabs } from "@/layouts/project-layout";
import SegmentedControl from "@/components/segmented";

const ProjectTasksPage = () => {
  const projCtx = useContext(ProjectContext);
  const { t } = useTranslation();
  const [selectedView, setSelectedView] = useState<string>("kanban")

  const viewTypeOptions = [
    {label: "kanban", value: <LuKanban/>},
    {label: "list", value: <LuList/>},
    {label: "calendar", value: <LuCalendar/>},
  ]

  return (
    <>
      <Stack 
        align={{"base": "left", "md": "center"}}
        direction={{"base": "column", "md": "row"}}
        spacing={2} 
      >
        <ProjectLayoutTabs />
        <VStack spacing={2} ml="auto">
          <SegmentedControl 
            selected={selectedView} 
            onSelectItem={(s) => {setSelectedView(s)}}
            size='xs' 
            items={viewTypeOptions}
          />
        </VStack>
      </Stack>
    </>
  );
};

export default ProjectTasksPage;
