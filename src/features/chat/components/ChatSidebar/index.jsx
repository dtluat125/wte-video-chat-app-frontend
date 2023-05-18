import { Box, Spinner, VStack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import ChatCard from "./ChatCard";
import ChatSidebarHeader from "./ChatSidebarHeader";

function ChatSideBar() {
  const { loading, conversations } = useSelector((state) => state.chat);
  return (
    <VStack
      bg="white"
      h="100vh"
      overflowY="auto"
      resize="horizontal"
      minW="300px"
    >
      <ChatSidebarHeader />
      {loading ? (
        <Box w="full" h="full" flex justifyContent="center" alignItems="center">
          <Spinner />
        </Box>
      ) : (
        <VStack w="full">
          {conversations?.map((chat) => {
            return <ChatCard key={chat.id} chat={chat} />;
          })}
        </VStack>
      )}
    </VStack>
  );
}

export default ChatSideBar;
