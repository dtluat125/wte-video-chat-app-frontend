import { VStack } from "@chakra-ui/react";
import ChatBoxBody from "./ChatBoxBody";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatInput from "./ChatInput";

function ChatBox() {
  return (
    <VStack
      bg="white"
      h="100vh"
      overflowY="auto"
      flex={1}
      minW="425px"
      spacing={0}
    >
      <ChatBoxHeader />
      <ChatBoxBody />
      <ChatInput />
    </VStack>
  );
}

export default ChatBox;
