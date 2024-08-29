import { useContext, useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { 
  VStack,
  Tag
} from "@chakra-ui/react";
import OrganizationContext from "@/contexts/organization";
import { useToast } from "@chakra-ui/react";
import RichList from "@/components/rich-list";
import { DiscussionTopicCategory } from "@/models/discussion";
import { listCategories } from "@/services/discussion";


const DiscussionCategoryManagerPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();

  const [categories, setCategories] = useState<DiscussionTopicCategory[]>([]);

  useEffect(() => {
    const id = Number(router.query.id);
    if (id) getCategoryList(id);
    else {
      setCategories([]);
    }
  }, [router.query.id]);

  const getCategoryList = async (org_id: number) => {
    try {
      const res = await listCategories(org_id);
      setCategories(res);
    } catch (error) {
      console.error(error);
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast ({
          title: t('Services.projects.listCategories.error'),
          status: 'error'
        })
      }
    }
  }

  return (
    <>
      <VStack spacing={6} align="stretch">
        <div>
          {categories && categories.length > 0 && (
            <RichList
              items={categories.map((item) => ({
                title: item.name,
                linePrefix: <Tag size="lg" p={2.5} colorScheme={item.color}>{item.emoji}</Tag>
              }))}
            />
          )}
        </div>
      </VStack>
    </>
  );
};

export default DiscussionCategoryManagerPage;