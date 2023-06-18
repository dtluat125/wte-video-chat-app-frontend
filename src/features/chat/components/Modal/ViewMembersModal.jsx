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
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import UserBadgeItem from "../User/UserBadgeItem";
import UserListItem from "../User/UserListItem";
import UserListItem2 from "../User/UserListItem2";

const ViewMembersModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { activeConversation } = useSelector((state) => state.chat);

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Members
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap">
              <VStack maxH="calc(100vh - 220px)" h="500px" overflowY="auto">
                {activeConversation.users.map((user) => (
                  <UserListItem2
                    key={user._id}
                    user={user}
                  />
                ))}
              </VStack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewMembersModal;
