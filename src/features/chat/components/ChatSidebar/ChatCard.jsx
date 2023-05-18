import { Avatar, AvatarBadge, HStack, Text, VStack } from "@chakra-ui/react";
import moment from "moment";
import { useMemo } from "react";
import { useSelector } from "react-redux";

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
  const chatName = useMemo(() => {
    if (!chat || !userInfo) return "";
    if (chat.isGroupChat) return chat.chatName;
    const partner = chat.users.find((user) => user.email !== userInfo.email);
    return partner?.name || userInfo.name;
  }, [chat, userInfo]);
  return (
    <HStack
      w="full"
      px={4}
      py={3}
      gap={2}
      cursor="pointer"
      _hover={{ bg: "gray.50" }}
    >
      <Avatar size="md" src={chat.image} name={chat.users?.[0]?.name}>
        <AvatarBadge boxSize="1em" bg="green.500" />
      </Avatar>
      <HStack flex={1}>
        <VStack align="start" flex={1} spacing={1}>
          <Text fontSize="sm" colorScheme="black" fontWeight={600}>
            {chatName}
          </Text>
          <Text fontSize="sm" color="gray">
            {chat.latestMessage}
          </Text>
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
