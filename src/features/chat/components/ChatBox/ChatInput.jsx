import {
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { BiMicrophone } from "react-icons/bi";
import { BsCardImage, BsFillSendFill } from "react-icons/bs";

const ChatInput = () => {
  return (
    <HStack w="full" px={4} py={4}>
      <InputGroup>
        <InputLeftElement>
          {/* <Box as={BiMicrophone} color="gray.500" /> */}
          <IconButton
            variant="link"
            rounded="full"
            icon={<BiMicrophone />}
            color="gray.500"
          />
        </InputLeftElement>
        <Input
          type="text"
          variant="filled"
          rounded="xl"
          placeholder="Type a message..."
        />
        <InputRightElement>
          {/* <Box as={BsCardImage} color="gray.500" /> */}
          <IconButton
            variant="link"
            rounded="full"
            icon={<BsCardImage />}
            color="gray.500"
          />
        </InputRightElement>
      </InputGroup>
      <IconButton variant="ghost" rounded="full" icon={<BsFillSendFill />} />
    </HStack>
  );
};

export default ChatInput;
