import {
  Avatar,
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AiOutlineLogout, AiOutlineMessage } from "react-icons/ai";
import { FiChevronDown, FiMenu, FiSettings } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { logOut } from "../../features/auth/auth.reducer";
import { BASE_URL, PageRoute } from "../constants";
import { SocketContext } from "../../plugins/socket/SocketProvider";
const LinkItems = [
  { name: "Messages", icon: AiOutlineMessage, to: PageRoute.CHAT_PAGE },
  { name: "Settings", icon: FiSettings, to: PageRoute.HOME_UPDATE_INFO_PAGE },
];

export const NavSize = {
  SMALL: "sm",
  LARGE: "lg",
};

export default function Sidebar({ children }) {
  const [navSize, setNavSize] = useState(NavSize.SMALL);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isSmallerThanMD] = useMediaQuery("(max-width: 768px)");
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        navSize={navSize}
        setNavSize={setNavSize}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent
            onClose={onClose}
            isMoblie={isSmallerThanMD}
            navSize={NavSize.LARGE}
          />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: navSize === NavSize.LARGE ? "240px" : "60px" }}>
        {children}
      </Box>
    </Box>
  );
}

const SidebarContent = ({
  onClose,
  setNavSize,
  navSize,
  isMoblie,
  ...rest
}) => {
  const changeNavSize = (size) => {
    setNavSize(size);
  };
  const history = useHistory();
  const dispatch = useDispatch();
  const socketService = useContext(SocketContext);
  const handleSignout = () => {
    localStorage.clear();
    history.replace("/login");
    socketService?.disconnect();
    dispatch(logOut());
  };
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: navSize === NavSize.LARGE ? "240px" : "60px" }}
      pos="fixed"
      h="full"
      zIndex={1}
      {...rest}
    >
      <Flex h="full" direction="column" justifyContent="space-between">
        <Box>
          <Flex
            h="20"
            alignItems="center"
            mx={navSize === NavSize.SMALL ? "2" : "8"}
            mr="2"
            justifyContent="space-between"
          >
            <Text
              fontSize="2xl"
              fontFamily="monospace"
              fontWeight="bold"
              display={navSize === NavSize.SMALL ? "none" : "block"}
            >
              Logo
            </Text>
            {!isMoblie && (
              <IconButton
                width={navSize === NavSize.SMALL ? "full" : "auto"}
                icon={<FiMenu />}
                onClick={() => {
                  if (navSize == NavSize.SMALL) changeNavSize(NavSize.LARGE);
                  else changeNavSize(NavSize.SMALL);
                }}
                variant="ghost"
              />
            )}
            <CloseButton
              display={{ base: "flex", md: "none" }}
              onClick={onClose}
            />
          </Flex>
          {LinkItems.map((link) => (
            <NavItem
              key={link.name}
              icon={link.icon}
              navSize={navSize}
              to={link.to}
            >
              {link.name}
            </NavItem>
          ))}
        </Box>
        <Flex
          h="20"
          w="full"
          align="center"
          justify={navSize === NavSize.LARGE ? "start" : "center"}
          mx={navSize === NavSize.LARGE ? 8 : 0}
        >
          <Menu>
            {userInfo && (
              <MenuButton>
                <HStack>
                  <Avatar
                    name={userInfo?.name}
                    src={`${BASE_URL}/${userInfo?.photo}`}
                    size="sm"
                  />
                  {navSize === NavSize.LARGE && (
                    <HStack>
                      <Text fontSize="sm">{userInfo?.name}</Text>
                      <Box display={{ base: "none", md: "flex" }}>
                        <FiChevronDown />
                      </Box>
                    </HStack>
                  )}
                </HStack>
              </MenuButton>
            )}
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem onClick={handleSignout}>
                <Icon mr={"4"} fontSize="16" as={AiOutlineLogout} />
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};

const NavItem = ({ icon, children, navSize, to, ...rest }) => {
  return (
    <Tooltip label={navSize === NavSize.SMALL && children} placement="right">
      <Link
        href={to}
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
      >
        <Flex
          align="center"
          // alignItems={navSize == NavSize.SMALL ? "center" : "flex-start"}
          justify={navSize == NavSize.SMALL ? "center" : "flex-start"}
          p="4"
          mx={navSize === NavSize.SMALL ? "1" : "4"}
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "cyan.400",
            color: "white",
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr={navSize === NavSize.SMALL ? "0" : "4"}
              fontSize="16"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {navSize === NavSize.LARGE && children}
        </Flex>
      </Link>
    </Tooltip>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>
    </Flex>
  );
};
