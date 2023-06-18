import { Box, Spinner, VStack, useColorModeValue } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import Message from "./Message";

function ChatBoxBody() {
  const { messages, messagesLoading, activeConversation } = useSelector(
    (state) => state.chat
  );

  const bg = useColorModeValue("gray.100", "gray.900");

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
      </ScrollableFeed>
    </VStack>
  ) : (
    <Box w="full" h="full" flex justifyContent="center" alignItems="center">
      <Spinner />
    </Box>
  );
}

export default ChatBoxBody;
