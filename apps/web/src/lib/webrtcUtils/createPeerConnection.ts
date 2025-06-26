import { iceServers } from "./iceServers";

export const createPeerConnection = () => {
    const pc = new RTCPeerConnection({ iceServers });
    console.log("peer connection", pc);
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE Candidate:", event.candidate);
      }
    };

    return pc;
};
