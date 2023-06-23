import { Box, Spinner, VStack, useColorModeValue } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import Message from "./Message";
import Lottie from "lottie-react";
import typingAnimation from "../../../../assets/animations/typing.json";
import { useContext, useEffect, useMemo, useState } from "react";
import { SocketContext } from "../../../../plugins/socket/SocketProvider";
import { ChatEvent } from "../../chat.reducer";

function ChatBoxBody({ typing }) {
  const { messages, messagesLoading, activeConversation } = useSelector(
    (state) => state.chat
  );
  const userInfo = useSelector((state) => state.auth.userInfo);

  const bg = useColorModeValue("gray.100", "gray.900");
  const chatPartner = useMemo(() => {
    if (!activeConversation || !userInfo) return "";
    if (activeConversation.isGroupChat)
      return { chatName: activeConversation.chatName };
    const partner = activeConversation.users?.find(
      (user) => user.email !== userInfo.email
    );
    return { ...(partner || {}), chatName: partner?.name || userInfo.name };
  }, [activeConversation, userInfo]);

  // const socketService = useContext(SocketContext);
  // const [typing, setTyping] = useState(false);
  // useEffect(() => {
  //   if (!activeConversation?._id) return;
  //   socketService.subscribe(ChatEvent.TYPING, (room, sender) => {
  //     console.log(room, sender)
  //     if (room === activeConversation?._id && userInfo?._id !== sender?._id)
  //       setTyping(true);
  //   });
  //   socketService.subscribe(ChatEvent.STOP_TYPING, (room) => {
  //     if (room === activeConversation?._id) setTyping(false);
  //   });
  //   return () => {
  //     socketService.unsubscribe(ChatEvent.TYPING);
  //   };
  // }, [activeConversation]);

  return !messagesLoading ? (
    <VStack
      bg={bg}
      flex={1}
      w="full"
      h="full"
      style={{ maxHeight: "calc(100vh-152px)" }}
      overflowY="auto"
    >
      <ScrollableFeed className="w-full p-4">
        {messages?.map((message) => (
          <Message key={message._id} message={message} />
        ))}
        {typing && (
          <Message chatPartner={chatPartner} isTypingMessage>
            <Lottie
              animationData={typingAnimation}
              width={50}
              style={{ marginBottom: 15, width: 60 }}
            />
          </Message>
        )}
      </ScrollableFeed>
    </VStack>
  ) : (
    <Box w="full" h="full" flex justifyContent="center" alignItems="center">
      <Spinner />
    </Box>
  );
}

export default ChatBoxBody;
