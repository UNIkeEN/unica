import React, { useContext } from "react";
import {
  Flex,
  VStack,
  HStack,
  Divider,
  Text,
  Box,
  BoxProps,
  Avatar,
  Spacer,
  Icon,
  Tooltip,
  Tag,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { DiscussionComment } from "@/models/discussion";
import { MemberRoleEnum } from "@/models/organization";
import { UserBasicInfo } from "@/models/user";
import MarkdownRenderer from "@/components/markdown-renderer";
import { formatRelativeTime } from "@/utils/datetime";
import { useTranslation } from "react-i18next";
import { FiEdit, FiTrash2, FiEdit3 } from "react-icons/fi";
import UserContext from "@/contexts/user";
import OrganizationContext from "@/contexts/organization";
import DeleteDiscussionAlertDialog from "@/components/modals/delete-discussion-alert-dialog";
import NewDiscussionDrawer from "./new-discussion-drawer";

interface CommentListProps extends BoxProps {
  items: DiscussionComment[];
  onCommentDelete: (comment: DiscussionComment) => void;
  onCommentEdit: (comment: DiscussionComment, newContent: string) => void;
  onTopicDelete: () => void;
  topic_op: UserBasicInfo;  // original poster
}

const CommentList: React.FC<CommentListProps> = ({
  items,
  onCommentDelete,
  onCommentEdit,
  onTopicDelete,
  topic_op,
  ...boxProps
}) => {
  const { t } = useTranslation();
  const userCtx = useContext(UserContext);
  const orgCtx = useContext(OrganizationContext);

  const [selectedComment, setSelectedComment] = React.useState<DiscussionComment | null>(null);
  const [editedComment, setEditedComment] = React.useState<string | null>(null);

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();

  const {
    isOpen: isEditDrawerOpen,
    onOpen: onEditDrawerOpen,
    onClose: onEditDrawerClose,
  } = useDisclosure();
  
  return (
    <Box {...boxProps}>
      {items && items.length > 0 && <Divider />}
      {items.map((item) => (
        <>
          <Flex px={4} py={4} justify="space-between" alignItems="flex-start">
            <Avatar mt={2} size="md" name={item.user.username} />
            <VStack spacing={2} ml={4} align="start" overflow="hidden" flex="1">
              <Flex width="100%" alignItems="center">
                <HStack spacing={2} flexWrap="wrap">
                  <Text
                    wordBreak="break-all"
                    fontSize="md"
                    fontWeight="semibold"
                    color="black"
                  >
                    {item.user.display_name}
                  </Text>
                  <Text className="secondary-text" wordBreak="break-all">
                    {item.user.username}
                  </Text>
                  {item.user.id === topic_op?.id &&
                    <Tag fontWeight="normal" colorScheme="gray">
                      {t("CommentList.tag.original-poster")}
                    </Tag>
                  }
                </HStack>
                <Spacer />
                <HStack spacing={2}>
                  {item.edited && (
                    <Tooltip
                      label={t("General.updated_at", {
                        time: formatRelativeTime(item.updated_at, t),
                      })}
                      aria-label="Edited"
                    >
                      <Icon as={FiEdit} color="orange" />
                    </Tooltip>
                  )}
                  <Text className="secondary-text">
                    {formatRelativeTime(item.created_at, t)}
                  </Text>
                </HStack>
              </Flex>
              <MarkdownRenderer
                content={item.content}
                minHeight="100px"
                width="100%"
              />
              {(userCtx.profile.id === item.user.id || orgCtx.basicInfo.role === MemberRoleEnum.OWNER) 
              && (
              <HStack spacing={0} ml="auto">
                <IconButton
                  variant="ghost"
                  aria-label="edit comment"
                  icon={<FiEdit3/>}
                  color="gray"
                  onClick={() => {
                    setEditedComment(item.content);
                    setSelectedComment(item);
                    onEditDrawerOpen();
                  }}
                />
                <IconButton
                  variant="ghost"
                  aria-label="delete comment"
                  icon={<FiTrash2 />}
                  color="gray"
                  onClick={() => {
                    onDeleteDialogOpen();
                    setSelectedComment(item);
                  }}
                />
              </HStack>
              )}
            </VStack>
          </Flex>
          <Divider />
        </>
      ))}
      {selectedComment && (
        <DeleteDiscussionAlertDialog
          isOpen={isDeleteDialogOpen}
          deleteObject={selectedComment.local_id === 1 ? "topic" : "comment"}
          onClose={onDeleteDialogClose}
          onOKCallback={() => {
            onDeleteDialogClose();
            if (selectedComment.local_id === 1) {
              onTopicDelete();
            } else {
              onCommentDelete(selectedComment);
            }
            setSelectedComment(null);
          }}
        />
      )}
      {selectedComment && <NewDiscussionDrawer
        isOpen={isEditDrawerOpen}
        onClose={onEditDrawerClose}
        drawerTitle={t("DiscussionTopicPage.drawer.editComment")}
        variant="comment"
        comment={editedComment}
        setComment={(comment) => {setEditedComment(comment);}}
        onOKCallback={() => {
          onEditDrawerClose();
          onCommentEdit(selectedComment, editedComment!);
          setSelectedComment(null);
        }}
        children={<></>}
      />}
    </Box>
  );
};

export default CommentList;
