import {
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiMicrophone } from "react-icons/bi";
import { BsCardImage, BsFillSendFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { sendMessage } from "../../chat.actions";

const ChatInput = ({ chatId }) => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const sendMessageAction = () => {
    dispatch(sendMessage({ chatId, content: message }));
    setMessage("");
  };
  const handleSendMessage = (e) => {
    if (e.key === "Enter" && message) sendMessageAction();
  };

  const onMessageChange = (e) => {
    setMessage(e.target.value);
  };
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
          onKeyDown={(e) => handleSendMessage(e)}
          onChange={onMessageChange}
          value={message}
        />
        <InputRightElement>
          {/* <Box as={BsCardImage} color="gray.500" /> */}
          <IconButton
            variant="link"
            rounded="full"
            icon={<BsCardImage />}
            color="gray.500"
            onClick={() => sendMessageAction()}
          />
        </InputRightElement>
      </InputGroup>
      <IconButton variant="ghost" rounded="full" icon={<BsFillSendFill />} />
    </HStack>
  );
};

export default ChatInput;
