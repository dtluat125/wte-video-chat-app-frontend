import { Box, Spinner, VStack, useColorModeValue } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import Message from "./Message";
import Lottie from "lottie-react";
import typingAnimation from "../../../../assets/animations/typing.json";
import { useMemo } from "react";

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
              width={70}
              style={{ marginBottom: 15 }}
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
