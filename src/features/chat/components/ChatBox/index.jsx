import { Spinner, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChatEvent,
  addMessage,
  setConversationList,
  setUserStatus,
} from "../../chat.reducer";
import ChatBoxBody from "./ChatBoxBody";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatInput from "./ChatInput";
import { cloneDeep } from "lodash";
import { SocketContext } from "../../../../plugins/socket/SocketProvider";
import JoinVideoCallModal from "../VideoCall/JoinVideoCallModal";

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

  const { isOpen, onOpen, onClose } = useDisclosure();

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

      console.log(activeConversation);
      if (newMessage.chat?._id === activeConversation?._id)
        dispatch(addMessage(newMessage));
    });

    return () => {
      console.log("unsubscribe");
      socketService.unsubscribe(ChatEvent.MESSAGE_RECEIVED);
    };
  }, [isSocketConnected, activeConversation]);

  const [inComingCall, setInComingCall] = useState(null);

  const handleJoinCall = () => {
    const win = window.open(`/room/${inComingCall?._id}`, "_blank");
    win.focus();
    onClose();
  };

  useEffect(() => {
    if (!userInfo?._id || !socketService) return;
    if (!isSocketConnected) return;
    console.log("setup", userInfo);
    socketService.emit(ChatEvent.SETUP, userInfo);

    socketService.subscribe(ChatEvent.ACTIVE, (userIds) => {
      console.log(userIds);
      setActiveUsers(userIds);
    });

    socketService.subscribe(ChatEvent.GLOBAL_ACTIVE, (userIds) => {
      console.log("GLOBAL_ACTIVE", userIds);
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

    socketService.subscribe(ChatEvent.NOTIFY_CALL, (chat, sender) => {
      if (sender?._id === userInfo?._id) return;
      setInComingCall(chat);
      onOpen();
    });
    return () => {
      socketService.unsubscribe(ChatEvent.ACTIVE);
      socketService.unsubscribe(ChatEvent.GLOBAL_ACTIVE);
      socketService.unsubscribe(ChatEvent.INACTIVE);
      socketService.unsubscribe(ChatEvent.NOTIFY_CALL);
    };
  }, [userInfo, isSocketConnected]);

  useEffect(() => {
    if (!userInfo?._id || !socketService) return;
    if (!isSocketConnected) return;
    socketService.subscribe(ChatEvent.TYPING, (room, sender) => {
      if (room === activeConversation?._id && userInfo._id !== sender?._id)
        setTyping(true);
      dispatch(
        setConversationList({
          _id: room,
          isTyping: true,
        })
      );
    });
    socketService.subscribe(ChatEvent.STOP_TYPING, (room) => {
      console.log(room, activeConversation?._id);
      if (room === activeConversation?._id) setTyping(false);
      dispatch(
        setConversationList({
          _id: room,
          isTyping: false,
        })
      );
    });

    return () => {
      socketService.unsubscribe(ChatEvent.TYPING);
      socketService.unsubscribe(ChatEvent.STOP_TYPING);
    };
  }, [userInfo, isSocketConnected, activeConversation]);

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

  return (
    <>
      <JoinVideoCallModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleJoinCall}
        chat={inComingCall}
      />

      {activeConversation ? (
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
      )}
    </>
  );
}

export default ChatBox;
