import MarkdownRenderer from "@/components/markdown-renderer";
import DeleteDiscussionAlertDialog from "@/components/modals/delete-discussion-alert-dialog";
import NewDiscussionDrawer from "@/components/new-discussion-drawer";
import { UserAvatar } from "./user-info-popover";
import OrganizationContext from "@/contexts/organization";
import UserContext from "@/contexts/user";
import { DiscussionComment } from "@/models/discussion";
import { MemberRoleEnum } from "@/models/organization";
import { UserBasicInfo } from "@/models/user";
import { formatRelativeTime } from "@/utils/datetime";
import {
  Box,
  BoxProps,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Tag,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiEdit3 } from "react-icons/fi";


interface CommentListProps extends BoxProps {
  items: DiscussionComment[];
  newCommentLocalId: number | null;
  onCommentDelete: (comment: DiscussionComment) => void;
  onCommentEdit: (comment: DiscussionComment, newContent: string) => void;
  onTopicDelete: () => void;
  topic_op: UserBasicInfo; // original poster
}

const CommentList: React.FC<CommentListProps> = ({
  items,
  newCommentLocalId,
  onCommentDelete,
  onCommentEdit,
  onTopicDelete,
  topic_op,
  ...boxProps
}) => {
  const { t } = useTranslation();
  const userCtx = useContext(UserContext);
  const orgCtx = useContext(OrganizationContext);

  const [selectedComment, setSelectedComment] =
    React.useState<DiscussionComment | null>(null);
  const [editedComment, setEditedComment] = React.useState<string | null>(null);

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
          <Flex px={1} py={4} justify="space-between" alignItems="flex-start"
            backgroundColor={item.local_id === newCommentLocalId ? 'blue.100' : 'transparent'}
            transition='background-color 2s ease'
            rounded='md' p='3'
          >
            <UserAvatar mt={2} size="md" user={item.user} />
            <VStack
              spacing={2}
              ml={{ base: "2", md: "4" }}
              align="start"
              overflow="hidden"
              flex="1"
            >
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
                  {item.user.id === topic_op?.id && (
                    <Tag fontWeight="normal" colorScheme="gray">
                      {t("CommentList.tag.original-poster")}
                    </Tag>
                  )}
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
                      <Box mt="1">
                        <Icon as={FiEdit} color="orange" />
                      </Box>
                    </Tooltip>
                  )}
                  <Text className="secondary-text">
                    {formatRelativeTime(item.created_at, t)}
                  </Text>
                </HStack>
              </Flex>
              <MarkdownRenderer
                content={item.content}
                minHeight="90px"
                width="100%"
              />
              <HStack spacing={0} ml="auto">
                {userCtx.profile.id === item.user.id && (
                  <IconButton
                    variant="ghost"
                    aria-label="edit comment"
                    icon={<FiEdit3 />}
                    color="gray"
                    onClick={() => {
                      setEditedComment(item.content);
                      setSelectedComment(item);
                      onEditDrawerOpen();
                    }}
                  />
                )}
                {(userCtx.profile.id === item.user.id ||
                  orgCtx.basicInfo.role === MemberRoleEnum.OWNER) && (
                    <DeleteDiscussionAlertDialog
                      deleteObject={item.local_id === 1 ? "topic" : "comment"}
                      onOKCallback={() => {
                        if (item.local_id === 1) {
                          onTopicDelete();
                        } else {
                          onCommentDelete(item);
                        }
                      }}
                    />
                  )}
              </HStack>
            </VStack>
          </Flex>
          <Divider />
        </>
      ))}
      {selectedComment && (
        <NewDiscussionDrawer
          isOpen={isEditDrawerOpen}
          onClose={onEditDrawerClose}
          drawerTitle={t("DiscussionTopicPage.drawer.editComment")}
          variant="comment"
          comment={editedComment}
          setComment={(comment) => {
            setEditedComment(comment);
          }}
          onOKCallback={() => {
            onEditDrawerClose();
            onCommentEdit(selectedComment, editedComment!);
            setSelectedComment(null);
          }}
        >
          <React.Fragment />
        </NewDiscussionDrawer>
      )}
    </Box>
  );
};

export default CommentList;
