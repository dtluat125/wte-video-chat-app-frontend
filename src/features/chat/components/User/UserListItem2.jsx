import {
  Avatar,
  Box,
  Divider,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaEllipsisV } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { accessChat } from "../../chat.actions";

const UserListItem2 = ({ user }) => {
  const dispatch = useDispatch();
  const handleMenuClick = () => {
    // Handle the menu option click (e.g., send a message to the user)
    dispatch(accessChat({ userId: user._id }));
  };

  return (
    <VStack w="100%">
      <HStack w="100%" p={2}>
        <Avatar size="sm" src={user.photo} alt={user.name} mr={2} />
        <Box flex={1}>
          <Text fontWeight={600}>{user.name}</Text>
        </Box>
        <Menu>
          <MenuButton
            ml="auto"
            as={IconButton}
            color="gray"
            icon={<FaEllipsisV />}
            rounded="full"
            variant="ghost"
            _expanded={{ bg: "gray.100" }}
          />
          <MenuList>
            <MenuItem onClick={handleMenuClick}>Message</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
      <Divider />
    </VStack>
  );
};

export default UserListItem2;
