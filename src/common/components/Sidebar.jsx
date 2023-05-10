import {
  Box,
  Button,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  Icon,
  IconButton,
  Link,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FiCompass,
  FiMenu,
  FiSettings,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import { AiOutlineMessage } from "react-icons/ai";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logOut } from "../../features/auth/auth.reducer";
import { useHistory } from "react-router-dom";

const LinkItems = [
  { name: "Messages", icon: AiOutlineMessage },
  { name: "Trending", icon: FiTrendingUp },
  { name: "Explore", icon: FiCompass },
  { name: "Favourites", icon: FiStar },
  { name: "Settings", icon: FiSettings },
];

export const NavSize = {
  SMALL: "sm",
  LARGE: "lg",
};

export default function Sidebar({ children }) {
  const [navSize, setNavSize] = useState(NavSize.LARGE);
  const { isOpen, onOpen, onClose } = useDisclosure();
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
          <SidebarContent onClose={onClose} navSize={NavSize.LARGE} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box
        ml={{ base: 0, md: navSize === NavSize.LARGE ? "240px" : "60px" }}
        p="4"
      >
        {children}
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, setNavSize, navSize, ...rest }) => {
  const changeNavSize = (size) => {
    setNavSize(size);
  };
  const history = useHistory();
  const dispatch = useDispatch();
  const handleSignout = () => {
    localStorage.clear();
    history.replace("/login");
    dispatch(logOut());
  };
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: navSize === NavSize.LARGE ? "240px" : "60px" }}
      pos="fixed"
      h="full"
      {...rest}
    >
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
        <IconButton
          width={navSize === NavSize.SMALL ? "full" : "auto"}
          icon={<FiMenu />}
          onClick={() => {
            if (navSize == NavSize.SMALL) changeNavSize(NavSize.LARGE);
            else changeNavSize(NavSize.SMALL);
          }}
          variant="ghost"
        />
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} navSize={navSize}>
          {link.name}
        </NavItem>
      ))}
      <Button variant="ghost" onClick={handleSignout}>
        Sign out
      </Button>
    </Box>
  );
};

const NavItem = ({ icon, children, navSize, ...rest }) => {
  return (
    <Tooltip label={navSize === NavSize.SMALL && children} placement="right">
      <Link
        href="#"
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
