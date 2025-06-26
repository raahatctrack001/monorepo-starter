'use client';

import React, { createContext, useContext, useState } from 'react';
import { safeSend } from '@/lib/context/safeSend';
import { useWebSocket } from './WebSocketContext';
import { useAppSelector } from '../store/hooks';

interface WebRTCContextType {
  peerConnection: RTCPeerConnection | null;
  initConnection: () => void;
  startCall: (ws: WebSocket, to: string, from: string, stream: MediaStream) => Promise<void>;
  endCall: () => void;
  getOrCreatePeerConnection: () => RTCPeerConnection;
}

export const WebRTCContext = createContext<WebRTCContextType | null>(null);

export const WebRTCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const { currentUser } = useAppSelector(state=>state.user);
    const { activeConversation } = useAppSelector(state=>state.conversation);
    const ws = useWebSocket();

  const initConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    // ICE candidate gathering
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE candidate generated:", event.candidate);
        alert("going to send ice candidate")
        safeSend(ws, {
          type: "call:ice-candidate",
          callInfo: {
            conversationId: activeConversation?._id.toString(),
            from: currentUser?._id.toString(),
            candidate: event.candidate
          }
        });
      }
    };

    setPeerConnection(pc);
    console.log("peerConnection initialized.");
    // return pc;
  };

  const getOrCreatePeerConnection = () => {
    if (!peerConnection) {
        const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });
        setPeerConnection(pc);
        console.log("New peerConnection created for incoming call.");
        return pc;
    }
    return peerConnection;
    };


  const startCall = async (ws: WebSocket, to: string, from: string, stream: MediaStream) => {
    if (!peerConnection) return;

    // Remove any existing tracks to avoid InvalidAccessError
    peerConnection.getSenders().forEach((sender) => peerConnection.removeTrack(sender));

    stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    safeSend(ws, {
      type: 'call:offer',
      callInfo: { conversationId: to, from, offer },
    });

    console.log('Offer created and sent to signaling server.');
  };

  const endCall = () => {
    if (peerConnection) {
      peerConnection.getSenders().forEach((sender) => peerConnection.removeTrack(sender));
      peerConnection.close();
      setPeerConnection(null);
      console.log('Call ended and peerConnection closed.');
    }
  };

  return (
    <WebRTCContext.Provider value={{ peerConnection, initConnection, getOrCreatePeerConnection, startCall, endCall }}>
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = () => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error('useWebRTC must be used within a WebRTCProvider');
  }
  return context;
};
