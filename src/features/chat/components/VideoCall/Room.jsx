import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  MdMic,
  MdMicOff,
  MdScreenShare,
  MdStopScreenShare,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Peer from "simple-peer";
import withUserValidation from "../../../../common/hocs/withUserValidation";

import { CloseIcon } from "@chakra-ui/icons";
import global from "global";
import * as process from "process";
import { BiFullscreen } from "react-icons/bi";
import SocketService from "../../../../plugins/socket";
global.process = process;

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
      console.log(stream);
    });
  }, []);

  return (
    <video
      autoPlay
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        borderRadius: "6px",
      }}
    />
  );
};

const videoConstraints = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  frameRate: { ideal: 30 },
};

const VideoRoom = () => {
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const params = useParams();
  const roomID = params.roomID;
  // const isSocketConnected = useSelector(
  //   (state) => state.auth.isSocketConnected
  // );

  const userInfo = useSelector((state) => state.auth.userInfo);
  const socketRef = useRef();
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);

  useEffect(() => {
    // Check if the camera is available
    const checkCameraAvailability = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setIsCameraAvailable(true);
        mediaStream.getTracks().forEach((track) => track.stop()); // Stop the media stream
      } catch (error) {
        setIsCameraAvailable(false);
      }
    };

    checkCameraAvailability();
  }, []);

  useEffect(() => {
    socketRef.current = new SocketService();
    const socketService = socketRef.current;
    socketService.connect();
    navigator.mediaDevices
      .getUserMedia({
        video: isCameraAvailable ? videoConstraints : false,
        audio: true,
      })
      .then((stream) => {
        console.log(stream);
        if (userVideo?.current) userVideo.current.srcObject = stream;
        socketService.emit("join room", roomID, userInfo);
        socketService.subscribe("all users", (users) => {
          console.log(users);
          const peers = [];
          users.forEach((user) => {
            // if (peers?.find((peer) => peer.peerID === user.socketId)) return;
            const peer = createPeer(user, socketService.socket.id, stream);
            peersRef.current.push({
              peerID: user.socketId,
              user: user,
              peer,
            });
            peers.push({ peer, user });
          });
          console.log(peersRef.current);
          setPeers(peers);
        });

        socketService.subscribe("user joined", (payload) => {
          console.log("new user joined: ", payload);
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            user: payload.user,
            peer,
          });

          setPeers((users) => [...users, { peer, user: payload.user }]);
        });

        socketService.subscribe("user left", (userID) => {
          const disconnectedPeer = peersRef.current.find(
            (p) => p.peerID === userID
          );
          if (disconnectedPeer) {
            disconnectedPeer.peer.destroy();
            peersRef.current = peersRef.current.filter(
              (p) => p.peerID !== userID
            );
            setPeers((prevPeers) =>
              prevPeers.filter((p) => p.peer !== disconnectedPeer.peer)
            );
          }
        });

        socketService.subscribe("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          console.log(item, peersRef.current, payload);
          item.peer.signal(payload.signal);
        });
      });

    return () => {
      // Clean up resources when the component unmounts
      peersRef.current.forEach((peer) => {
        peer.peer.destroy();
      });
      peersRef.current = [];
      setPeers([]);
      socketService.unsubscribe("user joined");
      socketService.unsubscribe("user left");
      socketService.unsubscribe("receiving returned signal");
      socketService.unsubscribe("all users");
      socketRef.current.disconnect();
    };
  }, [isCameraAvailable]);

  function createPeer(userToSignal, callerID, stream) {
    console.log("peer");

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    peer.on("signal", (signal) => {
      console.log("signal", signal);
      console.log("send signal: ", userToSignal);

      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
        userInfo,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const videoGridRef = useRef();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toggleAudio = () => {
    setIsAudioEnabled((prev) => !prev);
  };

  const toggleVideo = () => {
    setIsVideoEnabled((prev) => !prev);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };
  const toggleScreenSharing = () => {
    setIsScreenSharing((prev) => !prev);
  };
  return (
    <Box minH="100vh">
      <Flex align="center" justify="flex-end" py={4} px={8}>
        <Tooltip label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
          <IconButton
            aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            icon={isFullscreen ? <CloseIcon /> : <BiFullscreen />}
            variant="ghost"
            onClick={toggleFullscreen}
          />
        </Tooltip>
      </Flex>

      <Center h="calc(100vh - 120px)">
        <Box ref={videoGridRef} w="full" maxW="1200px" h="full" p={4}>
          <Flex
            flexWrap="wrap"
            justifyContent="space-between"
            gap={4}
            overflowY="auto"
            h="100%"
          >
            {/* Display user's video */}
            <Box
              bg="gray.200"
              w={{ base: "full", sm: isFullscreen ? "full" : "300px" }}
              h={{ base: "300px", sm: isFullscreen ? "full" : "300px" }}
              borderRadius="md"
              boxShadow="md"
              flexBasis={isFullscreen ? "100%" : "calc(50% - 8px)"}
              flexGrow={isFullscreen ? "1" : "0"}
              position={"relative"}
            >
              <video
                ref={userVideo}
                autoPlay
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "6px",
                }}
              />
              <Text
                position={"absolute"}
                bottom={0}
                fontWeight={700}
                width={"100%"}
                textAlign={"center"}
                color={"white"}
                fontSize={15}
              >
                {userInfo?.name}
              </Text>
            </Box>

            {/* Display participants' videos */}
            {peers.map((peer) => {
              console.log(peer);
              return (
                <Box
                  key={peer.peer._id}
                  bg="gray.200"
                  w={{ base: "full", sm: isFullscreen ? "full" : "300px" }}
                  h={{ base: "300px", sm: isFullscreen ? "full" : "300px" }}
                  borderRadius="md"
                  boxShadow="md"
                  flexBasis={isFullscreen ? "100%" : "calc(50% - 8px)"}
                  flexGrow={isFullscreen ? "1" : "0"}
                  position={"relative"}
                >
                  {/* Participant's video stream or participant information */}
                  <Video peer={peer.peer} />
                  <Text
                    position={"absolute"}
                    bottom={0}
                    fontWeight={700}
                    width={"100%"}
                    textAlign={"center"}
                    color={"white"}
                    fontSize={15}
                  >
                    {peer.user?.userInfo?.name}
                  </Text>
                </Box>
              );
            })}
          </Flex>
        </Box>
      </Center>

      <Flex
        align="center"
        justify="center"
        py={2}
        px={4}
        pos="fixed"
        bottom={0}
        left={0}
        right={0}
        borderTopWidth="1px"
        borderTopColor="gray.200"
        bg="white"
      >
        <HStack spacing={4}>
          <Tooltip label={isAudioEnabled ? "Mute Audio" : "Unmute Audio"}>
            <IconButton
              aria-label={isAudioEnabled ? "Mute Audio" : "Unmute Audio"}
              icon={isAudioEnabled ? <MdMic /> : <MdMicOff />}
              variant="ghost"
              onClick={toggleAudio}
            />
          </Tooltip>

          <Tooltip label={isVideoEnabled ? "Stop Video" : "Start Video"}>
            <IconButton
              aria-label={isVideoEnabled ? "Stop Video" : "Start Video"}
              icon={isVideoEnabled ? <MdVideocam /> : <MdVideocamOff />}
              variant="ghost"
              onClick={toggleVideo}
            />
          </Tooltip>

          <Tooltip
            label={isScreenSharing ? "Stop Screen Sharing" : "Share Screen"}
          >
            <IconButton
              aria-label={
                isScreenSharing ? "Stop Screen Sharing" : "Share Screen"
              }
              icon={isScreenSharing ? <MdStopScreenShare /> : <MdScreenShare />}
              variant="ghost"
              onClick={toggleScreenSharing}
            />
          </Tooltip>

          <Button colorScheme="red" onClick={onOpen}>
            End Meeting
          </Button>
        </HStack>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>End Meeting Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to end the meeting? This action cannot be
            undone.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={() => window.close()}>
              End Meeting
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default withUserValidation(VideoRoom);
