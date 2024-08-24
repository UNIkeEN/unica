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
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { DiscussionComment } from "@/models/discussion";
import MarkdownRenderer from "@/components/markdown-renderer";
import { formatRelativeTime } from "@/utils/datetime";
import { useTranslation } from "react-i18next";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import UserContext from "@/contexts/user";
import OrganizationContext from "@/contexts/organization";
import DeleteDiscussionAlertDialog from "./modals/delete-discussion-alert-dialog";

interface CommentListProps extends BoxProps {
  items: DiscussionComment[];
  onCommentDelete: (comment: DiscussionComment) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  items,
  onCommentDelete,
  ...boxProps
}) => {
  const { t } = useTranslation();
  const userCtx = useContext(UserContext);
  const orgCtx = useContext(OrganizationContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteComment, setDeleteComment] =
    React.useState<DiscussionComment | null>(null);

  return (
    <Box {...boxProps}>
      {items && items.length > 0 && <Divider />}
      {items.map((item) => (
        <>
          <Flex px={4} py={4} justify="space-between" alignItems="flex-start">
            <Avatar mt={2} size="md" name={item.user.email} />
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
                    {item.user.email}
                  </Text>
                </HStack>
                <Spacer />
                <HStack spacing={2}>
                  {item.created_at !== item.updated_at && (
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
              {(userCtx.profile.id === item.user.id ||
                orgCtx.basicInfo.role === "Owner") && (
                <IconButton
                  variant="ghost"
                  mt="auto"
                  ml="auto"
                  aria-label="delete comment"
                  icon={<FiTrash2 />}
                  color="gray"
                  onClick={() => {
                    onOpen();
                    setDeleteComment(item);
                  }}
                />
              )}
            </VStack>
          </Flex>
          <Divider />
        </>
      ))}
      {deleteComment && (
        <DeleteDiscussionAlertDialog
          isOpen={isOpen}
          deleteObject="comment"
          onClose={onClose}
          onOKCallback={() => {
            onCommentDelete(deleteComment);
            setDeleteComment(null);
            onClose();
          }}
        />
      )}
    </Box>
  );
};

export default CommentList;
