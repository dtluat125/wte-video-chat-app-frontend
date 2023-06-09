import {
  Box,
  Divider,
  HStack,
  IconButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { RiQuillPenLine } from "react-icons/ri";
import SideDrawer from "../SideDrawer";
import GroupChatModal from "../Modal/GroupChatModal";

function ChatSidebarHeader() {
  return (
    <Box w="full">
      <HStack justify="space-between" h="80px" p="4" bg="white" w="full">
        <Text fontSize="2xl" color="cyan.800" fontWeight={600}>
          Messages
        </Text>
        <HStack>
          <GroupChatModal>
            <Tooltip label="Create new Chat">
              <IconButton icon={<RiQuillPenLine />} rounded="full"></IconButton>
            </Tooltip>
          </GroupChatModal>

          <SideDrawer />
        </HStack>
      </HStack>
      <Divider />
    </Box>
  );
}

export default ChatSidebarHeader;
