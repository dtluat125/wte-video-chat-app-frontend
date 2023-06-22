import { Avatar, Box, HStack, Text, VStack } from "@chakra-ui/react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useMemo } from "react";

function Message({ message, isTypingMessage, children, chatPartner }) {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isYou = useMemo(() => {
    return userInfo?._id === message?.sender?._id;
  }, [userInfo, message]);

  if (!isYou)
    return (
      <HStack py={2} w="full" alignItems="start">
        <Avatar size="sm" />
        <VStack alignItems="start">
          <HStack>
            <Text>{chatPartner?.chatName || message?.sender?.name}</Text>
            {!isTypingMessage && (
              <Text fontSize="sm" color="gray">
                {moment(message?.createdAt).format("hh:mm A")}
              </Text>
            )}
          </HStack>
          {!isTypingMessage ? (
            <Box p={3} rounded="2xl" bgColor="gray.50">
              <Text align={"left"}>{message?.content}</Text>
            </Box>
          ) : (
            children
          )}
        </VStack>
      </HStack>
    );
  return (
    <HStack py={2} w="full" alignItems="start" justifyContent="end">
      <VStack alignItems="end">
        <HStack>
          <Text fontSize="sm" color="gray">
            {moment(message?.createdAt).format("HH:mm A")}
          </Text>
          <Text>You</Text>
        </HStack>
        <Box p={3} rounded="2xl" bgColor="gray.50">
          <Text align={"left"}>{message?.content}</Text>
        </Box>
      </VStack>
      <Avatar size="sm" />
    </HStack>
  );
}

export default Message;
