import io from "socket.io-client";
import { BASE_URL } from "../../common/constants";

const socket = io(BASE_URL); // Replace with your server URL
console.log("run this");

const socketService = {
  subscribe: (eventName, callback) => {
    socket.on(eventName, callback);
  },
  emit: (eventName, data) => {
    socket.emit(eventName, data);
  },
  unsubscribe: (eventName) => {
    socket.off(eventName);
  },
};

socketService.subscribe("connect", (socket) => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});
export default socketService;
