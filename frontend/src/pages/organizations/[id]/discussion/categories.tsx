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
import { DiscussionTopicCategory, emptyCategory } from "@/models/discussion";
import { MemberRoleEnum } from "@/models/organization";
import { createCategory, deleteCategory, updateCategory } from "@/services/discussion";
import RichList from "@/components/rich-list";
import CreateCategoryModal from "@/components/modals/create-category-modal";
import CategoryIcon from "@/components/category-icon";
import GenericAlertDialog from "@/components/modals/generic-alert-dialog";
import Pagination from "@/components/pagination";

const DiscussionCategoryManagerPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();

  const [categories, setCategories] = useState<DiscussionTopicCategory[]>([]);
  const [categoryCount, setCategoryCount] = useState(0);
  const [newCategory, setNewCategory] = useState<DiscussionTopicCategory>(emptyCategory);
  const [selectedCategory, setSelectedCategory] = useState<DiscussionTopicCategory | null>(null);
  const [isUpdate, setIsUpdate] = useState(false); // update or create
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  useEffect(() => {
    const id = Number(router.query.id);
    if (id) {
      orgCtx.handleListDiscussionCategories(page, pageSize, id)
      .then((res) => {
        setCategories(res.results);
        setCategoryCount(res.count);
      })
      .catch((error) => {
        setCategories([]);
        setCategoryCount(0);
      })
    } else {
      setCategories([]);
      setCategoryCount(0);
    }
  }, [router.query.id, page, pageSize]);

  const handleCreateCategory = async () => {
    try {
      const id = Number(router.query.id);
      const res = await createCategory(id, newCategory);
      if (res) {
        toast({
          title: t("Services.discussion.createCategory.success"),
          status: "success",
        });
        setCategories(res);
        onClose();
      }
    } catch (error) {
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t("Services.discussion.createCategory.error"),
          status: "error",
        });
      }
    }
  };

  const handleUpdateCategory = async (
    category: DiscussionTopicCategory,
    newCategory: DiscussionTopicCategory
  ) => {
    if (
      category.name === newCategory.name &&
      category.color === newCategory.color &&
      category.emoji === newCategory.emoji &&
      category.description === newCategory.description
    )
      return;
    try {
      const id = Number(router.query.id);
      const res = await updateCategory(id, category.id, newCategory);
      if (res) {
        toast({
          title: t("Services.discussion.updateCategory.success"),
          status: "success",
        });
        setCategories(res);
        onClose();
      }
    } catch (error) {
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t("Services.discussion.updateCategory.error"),
          status: "error",
        });
      }
    }
  };

  const handleDeleteCategory = async (category_id: number) => {
    try {
      const id = Number(router.query.id);
      const res = await deleteCategory(id, category_id);
      if (res) {
        toast({
          title: t("Services.discussion.deleteCategory.success"),
          status: "success",
        });
        setCategories(res);
        onDeleteClose();
      }
    } catch (error) {
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t("Services.discussion.deleteCategory.error"),
          status: "error",
        });
      }
    }
  };

  return (
    <>
      <VStack spacing={6} align="stretch">
        <Flex alignItems="center">
          <Text pl={1}>
            {t("DiscussionCategoryManagerPage.text.total", {
              count: categoryCount,
            })}
          </Text>
          <Spacer />
          <Button
            onClick={() => {
              setIsUpdate(false);
              setNewCategory(emptyCategory);
              onOpen();
            }}
            colorScheme="blue"
          >
            {t("DiscussionCategoryManagerPage.button.create")}
          </Button>
        </Flex>
        <>
          <RichList titleAsLink
            titleProps={{ color: "black" }}
            items={categories.map((item) => ({
              title: item.name,
              href: `/organizations/${router.query.id}/discussion?categoryId=${item.id}`,
              titleExtra: item.description 
                && <Text className="secondary-text" fontSize="sm">{item.description}</Text>,
              linePrefix: <CategoryIcon category={item} />,
              lineExtra: orgCtx.userRole === MemberRoleEnum.OWNER && (
                <Show above="md">
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsUpdate(true);
                        setNewCategory(item);
                        setSelectedCategory(item);
                        onOpen();
                      }}
                    >
                      {t("DiscussionCategoryManagerPage.button.edit")}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(item);
                        onDeleteOpen();
                      }}
                      colorScheme="red"
                      variant="subtle"
                    >
                      {t("DiscussionCategoryManagerPage.button.delete")}
                    </Button>
                  </HStack>
                </Show>
              ),
            }))}
          />
        </>
        {categoryCount > 0 &&
          <Flex>
            <Spacer />
            <Pagination
              total={Math.ceil(categoryCount / pageSize)}
              current={page}
              onPageChange={(page) => setPage(page)}
              colorScheme="blue"
              variant="subtle"
            />
          </Flex>
        }
      </VStack>

      <CreateCategoryModal
        isOpen={isOpen}
        onClose={onClose}
        isUpdate={isUpdate}
        category={newCategory}
        setCategory={setNewCategory}
        onOKCallback={
          isUpdate
            ? () => {
                handleUpdateCategory(selectedCategory, newCategory);
              }
            : handleCreateCategory
        }
      >
        <React.Fragment />
      </CreateCategoryModal>

      {selectedCategory && (
        <GenericAlertDialog
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          title={t("DeleteCategoryAlertDialog.dialog.title")}
          body={t("DeleteCategoryAlertDialog.dialog.content", {
            name: selectedCategory.name,
          })}
          btnOK={t("DeleteCategoryAlertDialog.dialog.confirm")}
          btnCancel={t("DeleteCategoryAlertDialog.dialog.cancel")}
          onOKCallback={() => handleDeleteCategory(selectedCategory.id)}
        />
      )}
    </>
  );
};

export default DiscussionCategoryManagerPage;