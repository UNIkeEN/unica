import React, { useContext, useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { 
  VStack,
  HStack,
  Flex,
  Spacer,
  Button,
  Text,
  Show,
  useDisclosure
} from "@chakra-ui/react";
import OrganizationContext from "@/contexts/organization";
import { useToast } from "@/contexts/toast";
import RichList from "@/components/rich-list";
import { DiscussionTopicCategory, emptyCategory } from "@/models/discussion";
import { MemberRoleEnum } from "@/models/organization";
import CreateCategoryModal from "@/components/modals/create-category-modal";
import CategoryIcon from "@/components/category-icon";

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
    if (id) {
      orgCtx.handleListDiscussionCategories(id)
      .then((res) => {setCategories(res);})
      .catch((error) => {setCategories([]);})
    } else {
      setCategories([]);
    }
  }, [router.query.id]);

  return (
    <>
      <VStack spacing={6} align="stretch">
        <Flex alignItems="center">
          <Text pl={1}>{t("DiscussionCategoryManagerPage.text.total", {count: categories ? categories.length : 0})}</Text>
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
                linePrefix: <CategoryIcon category={item} />,
                lineExtra: orgCtx.userRole === MemberRoleEnum.OWNER &&
                <Show above="md">
                  <HStack spacing={2}>
                    {/* TODO: Button logic */}
                    <Button size="sm">
                      {t('DiscussionCategoryManagerPage.button.edit')}
                    </Button>
                    <Button size="sm" colorScheme="red" variant="subtle">
                      {t('DiscussionCategoryManagerPage.button.delete')}
                    </Button>
                  </HStack>
                </Show>
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