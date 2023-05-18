import { Button, IconButton } from "@chakra-ui/button";
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
import { useToast } from "@chakra-ui/toast";
import { Tooltip } from "@chakra-ui/tooltip";
import axios from "axios";
import { useMemo, useState } from "react";
import { RiSearch2Line } from "react-icons/ri";
import ChatLoading from "./ChatLoading";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../chat.actions";
import { debounce } from "lodash";

function SideDrawer() {
  const { usersLoading, searchUsers } = useSelector((state) => state.chat);
  const [loadingChat, setLoadingChat] = useState(false);

  let setSelectedChat, user, chats, setChats;

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useDispatch();

  const handleSearch = async (value) => {
    dispatch(getUsers({ search: value.trim() }));
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

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
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {usersLoading ? (
              <ChatLoading />
            ) : (
              searchUsers?.map((user, index) => (
                <div key={index}>{user.name}</div>
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
