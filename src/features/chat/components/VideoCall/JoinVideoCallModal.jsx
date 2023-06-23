import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const JoinVideoCallModal = ({ isOpen, onClose, onConfirm, chat }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const chatName = useMemo(() => {
    if (!chat || !userInfo) return "";
    if (chat.isGroupChat) return chat.chatName;
    const partner = chat.users?.find((user) => user.email !== userInfo.email);
    return partner?.name || userInfo.name;
  }, [chat, userInfo]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="md">
        <ModalHeader>Join Video Call: {chatName}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Box mb={4}>
            <Text>
              You have been invited to join a video call. Do you want to join
              now?
            </Text>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={onConfirm}
            // isLoading={isJoining}
            loadingText="Joining..."
            mr={3}
          >
            Join Call
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Not Now
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JoinVideoCallModal;
