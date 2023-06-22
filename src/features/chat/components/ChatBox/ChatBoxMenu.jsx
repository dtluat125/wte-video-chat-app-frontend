import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { CiCircleMore } from "react-icons/ci";
import {
  FiUsers,
  FiUserPlus,
  FiUserMinus,
  FiLogOut,
  FiEdit,
} from "react-icons/fi";
import RenameGroupChatModal from "../Modal/RenameGroupChatModal";
import { useSelector } from "react-redux";
import AddMemberModal from "../Modal/AddMemberModal";
import ViewMembersModal from "../Modal/ViewMembersModal";
import { useMemo } from "react";

export default function ChatBoxMenu() {
  const { activeConversation } = useSelector((state) => state.chat);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const chatName = useMemo(() => {
    if (!activeConversation || !userInfo) return "";
    if (activeConversation.isGroupChat) return activeConversation.chatName;
    const partner = activeConversation.users.find(
      (user) => user.email !== userInfo.email
    );
    return partner?.name || userInfo.name;
  }, [activeConversation, userInfo]);
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        color="gray"
        icon={<CiCircleMore />}
        rounded="full"
        variant="ghost"
        _expanded={{ bg: "gray.100" }}
      ></MenuButton>
      <MenuList minWidth="200px" bg="white" boxShadow="lg" borderRadius="md">
        <MenuItem _hover={{ bg: "gray.100" }}>
          <Avatar
            size="sm"
            name={chatName}
            src="https://example.com/avatar.jpg"
            mr={2}
          />
          <Text fontWeight="bold">{chatName}</Text>
        </MenuItem>
        {activeConversation?.isGroupChat && (
          <ViewMembersModal>
            <MenuItem _hover={{ bg: "gray.100" }}>
              <FiUsers size={16} />
              <Text ml={2}>View Members</Text>
            </MenuItem>
          </ViewMembersModal>
        )}
        {activeConversation?.isGroupChat && (
          <AddMemberModal>
            <MenuItem _hover={{ bg: "gray.100" }}>
              <FiUserPlus size={16} />
              <Text ml={2}>Add Member</Text>
            </MenuItem>
          </AddMemberModal>
        )}
        {activeConversation?.isGroupChat && (
          <MenuItem _hover={{ bg: "gray.100" }}>
            <FiUserMinus size={16} />
            <Text ml={2}>Remove Member</Text>
          </MenuItem>
        )}
        {activeConversation?.isGroupChat && (
          <RenameGroupChatModal>
            <MenuItem _hover={{ bg: "gray.100" }}>
              <FiEdit size={16} />
              <Text ml={2}>Rename Chat</Text>
            </MenuItem>
          </RenameGroupChatModal>
        )}
        {activeConversation?.isGroupChat && (
          <MenuItem _hover={{ bg: "gray.100" }}>
            <FiLogOut size={16} />
            <Text ml={2}>Leave Chat</Text>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}
