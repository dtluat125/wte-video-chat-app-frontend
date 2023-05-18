import {
  Avatar,
  AvatarGroup,
  Box,
  Divider,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AiOutlinePhone, AiOutlineVideoCamera } from "react-icons/ai";

import { CiCircleMore } from "react-icons/ci";

function ChatBoxHeader() {
  return (
    <Box w="full">
      <HStack p="4" h="80px" bg="white" w="full" spacing={8}>
        <HStack spacing={6} flex={1}>
          <Avatar name="" />
          <VStack align="start" flex={1} spacing={1}>
            <Text fontSize="xl" colorScheme="black" fontWeight={600}>
              Odama Studio
            </Text>
            <Text fontSize="sm" color="gray"></Text>
          </VStack>
        </HStack>
        <AvatarGroup
          display={{ base: "none", sm: "flex" }}
          size="sm"
          max={3}
          spacing={-3}
          fontSize="2xs"
        >
          <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
          <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
          <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
          <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
          <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
        </AvatarGroup>
        <HStack spacing={1}>
          <IconButton
            color="gray"
            icon={<AiOutlinePhone />}
            rounded="full"
            variant="ghost"
          ></IconButton>
          <IconButton
            color="gray"
            icon={<AiOutlineVideoCamera />}
            rounded="full"
            variant="ghost"
          ></IconButton>
          <IconButton
            color="gray"
            icon={<CiCircleMore />}
            rounded="full"
            variant="ghost"
          ></IconButton>
        </HStack>
      </HStack>
      <Divider />
    </Box>
  );
}

export default ChatBoxHeader;
