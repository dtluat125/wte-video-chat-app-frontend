import Peer from "peerjs";

class PeerConnection {
  constructor() {
    this.peer = new Peer();

    this.peer.on("open", (peerId) => {
      console.log("Connected with peer ID:", peerId);
    });

    this.peer.on("call", (incomingCall) => {
      console.log("Incoming call from:", incomingCall.peer);
      this.onCall(incomingCall);
    });
  }

  onCall(call) {
    // Handle incoming call
    // You can define your custom logic here
    console.log("Incoming call:", call);
  }

  onRemoteClose() {
    // Handle when the remote peer closes the call
    // You can define your custom logic here
    console.log("Remote peer closed the call");
  }

  makeCall(remotePeerId, localStream) {
    const call = this.peer.call(remotePeerId, localStream);
    call.on("close", this.onRemoteClose.bind(this));

    return call;
  }

  destroy() {
    this.peer.destroy();
  }

  getPeerId() {
    return new Promise((resolve) => {
      if (this.peer.id) {
        resolve(this.peer.id);
      } else {
        this.peer.on("open", (peerId) => {
          resolve(peerId);
        });
      }
    });
  }
}

export default PeerConnection;
