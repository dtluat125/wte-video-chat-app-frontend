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
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMembersToGroup,
  getUsers,
} from "../../chat.actions";
import { clearSearch } from "../../chat.reducer";
import UserBadgeItem from "../User/UserBadgeItem";
import UserListItem from "../User/UserListItem";

const AddMemberModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const {
    usersLoading,
    searchUsers,
    addMembersToGroupLoading,
    activeConversation,
  } = useSelector((state) => state.chat);
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

  const onAddMembersToGroupSuccess = () => {
    onClose();
    toast({
      title: "New members added!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  const onAddMembersToGroupRejected = (message) => {
    toast({
      title: "Failed to add members!",
      description: message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  const handleSubmit = async () => {
    if (!selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    dispatch(
      addMembersToGroup({
        userIds: selectedUsers.map((user) => user._id),
        chatId: activeConversation._id,
      })
    )
      .unwrap()
      .then(() => {
        onAddMembersToGroupSuccess();
      })
      .catch((rejectedValue) => {
        onAddMembersToGroupRejected(rejectedValue);
      });
  };

  const filteredUsers = useMemo(() => {
    return searchUsers.filter(
      (user) =>
        !activeConversation.users.find(
          (currentUser) => currentUser._id === user._id
        )
    );
  }, [searchUsers, activeConversation.users]);

  useEffect(() => {
    handleSearch("");
  }, []);

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
            Add people
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Search"
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
            ) : filteredUsers?.length > 0 ? (
              <VStack maxH="calc(100vh - 220px)" h="500px" overflowY="auto">
                {filteredUsers.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))}
              </VStack>
            ) : (
              <span>No user found</span>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleSubmit}
              colorScheme="blue"
              disabled={addMembersToGroupLoading}
              mr={3}
            >
              {addMembersToGroupLoading && <Spinner ml="auto" d="flex" />} Add
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

export default AddMemberModal;
