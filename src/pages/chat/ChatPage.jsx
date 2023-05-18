import { useDispatch } from "react-redux";
import MainLayout from "../../common/layout/MainLayout";
import { getConversations } from "../../features/chat/chat.actions";
import ChatBox from "../../features/chat/components/ChatBox";
import ChatSideBar from "../../features/chat/components/ChatSidebar";
import { HStack, Divider } from "@chakra-ui/react";
import { useEffect } from "react";

function ChatPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getConversations());
  }, []);
  return (
    <MainLayout>
      <HStack spacing={0}>
        <ChatSideBar />
        <Divider orientation="verticle" height="full" width="1px" />
        <ChatBox />
      </HStack>
    </MainLayout>
  );
}

export default ChatPage;
