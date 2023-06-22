import io from "socket.io-client";
import { BASE_URL } from "../../common/constants";

class SocketService {
  constructor(authToken) {
    this.authToken = authToken;
    this.socket = null;
  }

  connect() {
    this.socket = io(BASE_URL);

    // Add event listeners and handle socket events
    // ...
  }

  subscribe(eventName, callback) {
    this.socket?.on(eventName, callback);
  }

  emit(eventName, data) {
    this.socket?.emit(eventName, data);
  }

  unsubscribe(eventName) {
    this.socket?.off(eventName);
  }

  disconnect() {
    this.socket?.disconnect();
  }
}

export default SocketService;
