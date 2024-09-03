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
import Pagination from "@/components/pagination";
import CategoryIcon from "@/components/category-icon";

const DiscussionCategoryManagerPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();

  const [categories, setCategories] = useState<DiscussionTopicCategory[]>([]);
  const [categoryCount, setCategoryCount] = useState<number>(0);
  const [newCategory, setNewCategory] = useState<DiscussionTopicCategory>(emptyCategory);
  const [pageIndex, setPageIndex] = useState<number>(1);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const id = Number(router.query.id);
    if (id) handleListCategories(id);
    else {
      setCategories([]);
    }
  }, [router.query.id, pageIndex]);

  const handleListCategories = async (org_id: number) => {
    try {
      const res = await listCategories(org_id, pageIndex, 20);
      setCategoryCount(res.count);
      setCategories(res.results);
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
      setCategories([]);
      setCategoryCount(0);
    }
  }

  return (
    <>
      <VStack spacing={6} align="stretch">
        <Flex alignItems="center">
          <Text pl={1}>{t("DiscussionCategoryManagerPage.text.total", {count: categoryCount})}</Text>
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
                linePrefix: <CategoryIcon category={item} />
              }))}
            />
            <Flex>
            <Spacer />
            <Pagination
              total={Math.ceil(categoryCount / 20)}
              current={pageIndex}
              onPageChange={(page) => setPageIndex(page)}
              colorScheme="blue"
              variant="subtle"
            />
          </Flex>
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