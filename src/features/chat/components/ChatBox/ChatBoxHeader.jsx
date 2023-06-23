import {
  Avatar,
  AvatarGroup,
  Box,
  Divider,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AiOutlinePhone, AiOutlineVideoCamera } from "react-icons/ai";

import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../../plugins/socket/SocketProvider";
import { ChatEvent } from "../../chat.reducer";
import ChatBoxMenu from "./ChatBoxMenu";

function ChatBoxHeader() {
  const chat = useSelector((state) => state.chat.activeConversation);

  const userInfo = useSelector((state) => state.auth.userInfo);
  const activeConversation = useSelector(
    (state) => state.chat.activeConversation
  );

  const socketService = useContext(SocketContext);

  const handleInitGroupCall = () => {
    if (!socketService?.socket || !activeConversation?._id) return;
    socketService.emit(ChatEvent.INIT_CALL, activeConversation, userInfo);
    // history.push(`/room/${activeConversation?._id}`);
    const win = window.open(`/room/${activeConversation?._id}`, "_blank");
    win.focus();
  };

  const chatName = useMemo(() => {
    if (!chat || !userInfo) return "";
    if (chat.isGroupChat) return chat.chatName;
    const partner = chat.users?.find((user) => user.email !== userInfo.email);
    return partner?.name || userInfo.name;
  }, [chat, userInfo]);
  return (
    <Box w="full">
      <HStack p="4" h="80px" bg="white" w="full" spacing={8}>
        <HStack spacing={6} flex={1}>
          <Avatar name="" />
          <VStack align="start" flex={1} spacing={1}>
            <Text fontSize="xl" colorScheme="black" fontWeight={600}>
              {chatName}
            </Text>
            <Text fontSize="sm" color="gray"></Text>
          </VStack>
        </HStack>
        {chat.isGroupChat && (
          <AvatarGroup
            display={{ base: "none", sm: "flex" }}
            size="sm"
            max={3}
            spacing={-3}
            fontSize="2xs"
          >
            {chat?.users?.map(
              (user, index) =>
                user && (
                  <Avatar
                    key={user._id || index}
                    name={user.name}
                    src={user.photo}
                  />
                )
            )}
          </AvatarGroup>
        )}
        <HStack spacing={1}>
          <IconButton
            color="gray"
            icon={<AiOutlinePhone />}
            rounded="full"
            variant="ghost"
          ></IconButton>
          <IconButton
            color="gray"
            icon={<AiOutlineVideoCamera />}
            rounded="full"
            variant="ghost"
            onClick={handleInitGroupCall}
          ></IconButton>
          <ChatBoxMenu />
        </HStack>
      </HStack>
      <Divider />
    </Box>
  );
}

export default ChatBoxHeader;
