import { Spinner, Text, VStack, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketService from "../../../../plugins/socket";
import { ChatEvent, addMessage } from "../../chat.reducer";
import ChatBoxBody from "./ChatBoxBody";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatInput from "./ChatInput";

function ChatBox() {
  const { messages, messagesLoading, activeConversation, accessChatLoading } =
    useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const toast = useToast();

  const { userInfo } = useSelector((state) => state.auth);

  const [socketConnected, setSocketConnected] = useState(false);
  useEffect(() => {
    if (!activeConversation) return;
    console.log("subscribe");
    socketService.subscribe(ChatEvent.MESSAGE_RECEIVED, (newMessage) => {
      console.log("socket call here");
      if (
        !activeConversation ||
        activeConversation._id !== newMessage.chat._id
      ) {
        toast({
          status: "error",
          description: "Something went wrong",
        });
      } else {
        dispatch(addMessage(newMessage));
      }
    });

    return () => {
      console.log("unsubscribe");
      socketService.unsubscribe(ChatEvent.MESSAGE_RECEIVED);
    };
  }, [activeConversation]);

  useEffect(() => {
    if (!userInfo) return;

    socketService.emit(ChatEvent.SETUP, userInfo);
    socketService.subscribe("connected", () => setSocketConnected(true));
    return () => {
      socketService.unsubscribe("connected");
    };
  }, [userInfo]);

  return activeConversation ? (
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
      <ChatInput chatId={activeConversation._id} />
    </VStack>
  ) : accessChatLoading ? (
    <Spinner />
  ) : (
    <Text fontSize="2xl" p={4}>
      Select a chat
    </Text>
  );
}

export default ChatBox;
