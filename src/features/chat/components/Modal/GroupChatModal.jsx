import {
  Box,
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
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { debounce } from "lodash";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroupChat, getUsers } from "../../chat.actions";
import { clearSearch } from "../../chat.reducer";
import UserBadgeItem from "../User/UserBadgeItem";
import UserListItem from "../User/UserListItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { usersLoading, searchUsers, createGroupChatLoading } = useSelector(
    (state) => state.chat
  );
  const toast = useToast();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const dispatch = useDispatch();

  const handleSearch = async (value) => {
    dispatch(getUsers({ search: value.trim() }));
  };

  const debouncedResults = debounce(handleSearch, 300);

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const onCreateGroupChatSuccess = () => {
    onClose();
    toast({
      title: "New Group Chat Created!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  const onCreateGroupChatRejected = (message) => {
    toast({
      title: "Failed to Create the Chat!",
      description: message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    dispatch(
      createGroupChat({
        name: groupChatName,
        users: selectedUsers.map((user) => user._id),
      })
    )
      .unwrap()
      .then(() => {
        onCreateGroupChatSuccess();
      })
      .catch((rejectedValue) => {
        onCreateGroupChatRejected(rejectedValue);
      });
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal
        onClose={() => {
          dispatch(clearSearch);
          onClose();
        }}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => debouncedResults(e.target.value)}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {usersLoading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              <VStack maxH="200px" overflowY="auto">
                {searchUsers.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleSubmit}
              colorScheme="blue"
              disabled={createGroupChatLoading}
            >
              {createGroupChatLoading && <Spinner ml="auto" d="flex" />} Create
              Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
