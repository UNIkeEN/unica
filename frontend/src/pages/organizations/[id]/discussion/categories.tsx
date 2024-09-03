import React, { useContext, useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { 
  VStack,
  Flex,
  Spacer,
  Button,
  Tag,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import OrganizationContext from "@/contexts/organization";
import { useToast } from "@/contexts/toast";
import RichList from "@/components/rich-list";
import { DiscussionTopicCategory, emptyCategory } from "@/models/discussion";
import { listCategories } from "@/services/discussion";
import CreateCategoryModal from "@/components/modals/create-category-modal";


const DiscussionCategoryManagerPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();

  const [categories, setCategories] = useState<DiscussionTopicCategory[]>([]);
  const [newCategory, setNewCategory] = useState<DiscussionTopicCategory>(emptyCategory);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const id = Number(router.query.id);
    if (id) handleListCategories(id);
    else {
      setCategories([]);
    }
  }, [router.query.id]);

  const handleListCategories = async (org_id: number) => {
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
        <Flex alignItems="center">
          <Text pl={1}>{t("DiscussionCategoryManagerPage.text.total", {count: categories.length})}</Text>
          <Spacer/>
          <Button onClick={onOpen} colorScheme="blue">
            {t("DiscussionCategoryManagerPage.button.create")}
          </Button>
        </Flex>
        {categories && categories.length > 0 && (
          <>
            <RichList
              items={categories.map((item) => ({
                title: item.name,
                linePrefix: <Tag size="lg" p={2.5} colorScheme={item.color}>{item.emoji || "💬"}</Tag>
              }))}
            />
          </>
        )}
      </VStack>

      <CreateCategoryModal
        isOpen={isOpen}
        onClose={onClose}
        category={newCategory}
        setCategory={setNewCategory}
      >
        <React.Fragment />
      </CreateCategoryModal>
    </>
  );
};

export default DiscussionCategoryManagerPage;