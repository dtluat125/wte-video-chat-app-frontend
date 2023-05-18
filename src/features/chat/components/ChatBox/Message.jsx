import { Avatar, Box, HStack, Text, VStack } from "@chakra-ui/react";

function Message({ isYou = false }) {
  if (!isYou)
    return (
      <HStack w="full" alignItems="start">
        <Avatar size="sm" />
        <VStack alignItems="start">
          <HStack>
            <Text>Milie Nose</Text>
            <Text fontSize="sm" color="gray">
              9:30 AM
            </Text>
          </HStack>
          <Box p={3} rounded="2xl" bgColor="gray.50">
            <Text>My message go here</Text>
          </Box>
        </VStack>
      </HStack>
    );
  return (
    <HStack w="full" alignItems="start" justifyContent='end'>
      <VStack alignItems="end">
        <HStack>
          <Text fontSize="sm" color="gray">
            9:30 AM
          </Text>
          <Text>You</Text>
        </HStack>
        <Box p={3} rounded="2xl" bgColor="gray.50">
          <Text>My message go here</Text>
        </Box>
      </VStack>
      <Avatar size="sm" />
    </HStack>
  );
}

export default Message;
