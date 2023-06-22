import { Spinner, Text, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChatEvent,
  setConversationList,
  setUserStatus,
} from "../../chat.reducer";
import ChatBoxBody from "./ChatBoxBody";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatInput from "./ChatInput";
import { cloneDeep } from "lodash";
import { SocketContext } from "../../../../plugins/socket/SocketProvider";

function ChatBox() {
  const {
    activeConversation,
    accessChatLoading,
    loading,
    conversations,
    toggleFetch,
  } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const { userInfo, isSocketConnected } = useSelector((state) => state.auth);

  const [typing, setTyping] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const socketService = useContext(SocketContext);

  useEffect(() => {
    if (!isSocketConnected) return;
    socketService?.subscribe(ChatEvent.MESSAGE_RECEIVED, (newMessage) => {
      dispatch(
        setConversationList({
          _id: newMessage.chat._id,
          latestMessage: newMessage,
          isTyping: false,
          isReorder: true,
        })
      );
    });

    return () => {
      console.log("unsubscribe");
      socketService.unsubscribe(ChatEvent.MESSAGE_RECEIVED);
    };
  }, [isSocketConnected]);

  useEffect(() => {
    console.log(socketService);
    if (!userInfo?._id || !socketService) return;
    if (!isSocketConnected) return;
    console.log("setup", userInfo);
    socketService.emit(ChatEvent.SETUP, userInfo);
    socketService.subscribe(ChatEvent.TYPING, (room) => {
      if (room === activeConversation?._id) setTyping(true);
      else {
        dispatch(
          setConversationList({
            _id: room,
            isTyping: true,
          })
        );
      }
    });
    socketService.subscribe(ChatEvent.STOP_TYPING, (room) => {
      if (room === activeConversation?._id) setTyping(false);
      else {
        dispatch(
          setConversationList({
            _id: room,
            isTyping: false,
          })
        );
      }
    });

    socketService.subscribe(ChatEvent.ACTIVE, (userIds) => {
      console.log(userIds);
      setActiveUsers(userIds);
    });

    socketService.subscribe(ChatEvent.GLOBAL_ACTIVE, (userIds) => {
      setActiveUsers(userIds);
    });

    socketService.subscribe(ChatEvent.INACTIVE, (userId) => {
      console.log(
        "Someone disconnect: ",
        userId,
        activeUsers.filter((activeUserId) => activeUserId !== userId)
      );
      if (!userId || userId === userInfo?._id) return;
      setActiveUsers(
        activeUsers.filter((activeUserId) => activeUserId !== userId)
      );

      dispatch(setUserStatus({ userId, active: false }));
    });
    return () => {
      socketService.unsubscribe(ChatEvent.TYPING);
      socketService.unsubscribe(ChatEvent.STOP_TYPING);
      socketService.unsubscribe(ChatEvent.ACTIVE);
      socketService.unsubscribe(ChatEvent.GLOBAL_ACTIVE);
      socketService.unsubscribe(ChatEvent.INACTIVE);
    };
  }, [userInfo, isSocketConnected]);

  useEffect(() => {
    console.log(activeUsers);
    if (!loading && conversations?.length > 0) {
      console.log(loading, cloneDeep(activeUsers));

      activeUsers.forEach((userId) => {
        if (!userId || userId === userInfo?._id) return;
        console.log(userId);

        dispatch(setUserStatus({ userId, active: true }));
      });
    }
  }, [activeUsers, loading, toggleFetch]);

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
      <ChatBoxBody typing={typing} />
      <ChatInput
        chat={activeConversation}
        typing={typing}
        setTyping={setTyping}
        socketConnected={isSocketConnected}
      />
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
