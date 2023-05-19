import { IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Spinner } from "@chakra-ui/spinner";
import { Tooltip } from "@chakra-ui/tooltip";
import { debounce } from "lodash";
import { useState, useEffect } from "react";
import { RiSearch2Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { accessChat, getChat, getUsers } from "../chat.actions";
import ChatLoading from "./ChatLoading";
import UserListItem from "./User/UserListItem";

function SideDrawer() {
  const {
    usersLoading,
    searchUsers,
    accessChatLoading,
    accessChatError,
    accessChatResponse,
  } = useSelector((state) => state.chat);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useDispatch();

  const handleSearch = async (value) => {
    dispatch(getUsers({ search: value.trim() }));
  };

  const handleAccessChat = (value) => {
    dispatch(accessChat({ userId: value }));
  };

  useEffect(() => {
    if (!accessChatLoading && !accessChatError && accessChatResponse) {
      dispatch(getChat({ chatId: accessChatResponse._id }));
    }
  }, [accessChatLoading, accessChatError, accessChatResponse, dispatch]);
  const debouncedResults = debounce(handleSearch, 300);

  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
      >
        <Tooltip label="Search Chat">
          <IconButton
            onClick={onOpen}
            icon={<RiSearch2Line />}
            rounded="full"
          ></IconButton>
        </Tooltip>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                onChange={(e) => debouncedResults(e.target.value)}
              />
            </Box>
            {usersLoading ? (
              <ChatLoading />
            ) : (
              searchUsers?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAccessChat(user._id)}
                />
              ))
            )}
            {accessChatLoading && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
