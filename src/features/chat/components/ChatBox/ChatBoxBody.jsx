import { VStack, useColorModeValue } from "@chakra-ui/react";
import Message from "./Message";

function ChatBoxBody() {
  return (
    <VStack
      bg={useColorModeValue("gray.100", "gray.900")}
      flex={1}
      w="full"
      p={4}
      style={{ maxHeight: "calc(100vh-152px)" }}
      overflowY="auto"
    >
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message isYou />
    </VStack>
  );
}

export default ChatBoxBody;
