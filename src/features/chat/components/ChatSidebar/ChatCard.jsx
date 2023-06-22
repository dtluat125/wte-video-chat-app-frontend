import { Avatar, AvatarBadge, Box, HStack, Text, VStack } from "@chakra-ui/react";
import Lottie from "lottie-react";
import moment from "moment";
import { useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import typingAnimation from "../../../../assets/animations/typing.json";
import { SocketContext } from "../../../../plugins/socket/SocketProvider";
import { getChat } from "../../chat.actions";
import { ChatEvent, setActiveConversation } from "../../chat.reducer";

function ChatCard({ chat }) {
  const updatedTime = useMemo(() => {
    const updatedTime = chat.updatedAt || new Date();
    const momentTime = moment(updatedTime);
    const isToday = momentTime.isSame(new Date(), "day");
    if (isToday) {
      return momentTime.format("H:mm");
    } else if (momentTime.diff(new Date(), "days") === 1) return "Yesterday";
    else {
      return momentTime.format("D/M");
    }
  }, [chat]);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const activeConversation = useSelector(
    (state) => state.chat.activeConversation
  );
  const chatName = useMemo(() => {
    if (!chat || !userInfo) return "";
    if (chat.isGroupChat) return chat.chatName;
    const partner = chat.users.find((user) => user.email !== userInfo.email);
    return partner?.name || userInfo.name;
  }, [chat, userInfo]);
  const socketService = useContext(SocketContext);
  const active = () => activeConversation?._id === chat?._id;
  const dispatch = useDispatch();
  const handleClickChatCard = () => {
    if (active()) return;
    dispatch(setActiveConversation(chat));
    dispatch(getChat({ chatId: chat._id }))
      .unwrap()
      .then(() => {
        socketService.emit(ChatEvent.JOIN_CHAT, chat._id);
      });
  };

  const isYou = useMemo(() => {
    return userInfo?._id === chat.latestMessage?.sender?._id;
  }, [userInfo, chat]);

  const sender = useMemo(() => {
    return isYou ? "You" : chat.latestMessage?.sender.name;
  }, [isYou, chat]);
  return (
    <HStack
      w="full"
      px={4}
      py={3}
      gap={2}
      cursor="pointer"
      _hover={{ bg: "gray.50" }}
      bg={active() ? "gray.50" : ""}
      onClick={handleClickChatCard}
    >
      <Avatar size="md" src={chat.image} name={chatName}>
        {chat.active && <AvatarBadge boxSize="1em" bg="green.500" />}
      </Avatar>
      <HStack flex={1}>
        <VStack align="start" flex={1} spacing={1}>
          <Text fontSize="sm" colorScheme="black" fontWeight={600}>
            {chatName}
          </Text>
          <Box
            fontSize="sm"
            color="gray"
            whiteSpace={"nowrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            w="auto"
            maxW="150px"
          >
            {chat.isTyping ? (
              <Lottie
                width={20}
                style={{ width: 40 }}
                animationData={typingAnimation}
              />
            ) : (
              (sender ? `${sender}: ` : "") +
              (chat.latestMessage?.content || "Send your first message")
            )}
          </Box>
        </VStack>
        <VStack spacing={1}>
          <Text fontSize="sm" color="gray">
            {updatedTime}
          </Text>
          <Text fontSize="sm" color="gray" h="24px">
            {" "}
          </Text>
        </VStack>
      </HStack>
    </HStack>
  );
}

export default ChatCard;
