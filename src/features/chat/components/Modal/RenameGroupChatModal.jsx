import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { renameGroupChat } from "../../chat.actions";

const RenameGroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { renameGroupChatLoading, activeConversation } = useSelector(
    (state) => state.chat
  );
  const [chatName, setChatName] = useState(activeConversation.chatName);
  const dispatch = useDispatch();
  const toast = useToast();

  const handleRename = () => {
    if (!chatName.trim()) {
      toast({
        title: "Please enter a valid chat name",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    dispatch(renameGroupChat({ chatId: activeConversation._id, chatName }))
      .unwrap()
      .then(() => {
        onClose();
        toast({
          title: "Chat renamed successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      })
      .catch((error) => {
        toast({
          title: "Failed to rename the chat",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      });
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Chat Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleRename}>
              {renameGroupChatLoading ? <Spinner size="sm" /> : "Rename"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RenameGroupChatModal;
