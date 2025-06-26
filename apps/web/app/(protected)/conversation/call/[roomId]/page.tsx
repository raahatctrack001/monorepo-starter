"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { VideoPlayer } from "../_components/VideoPlayer";
import { CallControls } from "../_components/CallControl";
import { useAppSelector } from "@/lib/store/hooks";
import { useWebSocket } from "@/lib/context/WebSocketContext";
import { safeSend } from "@/lib/context/safeSend";
import { useWebRTC } from "@/lib/context/WebRTCContext";

export default function CallPage() {
    const { roomId } = useParams();
    console.log("room Id: ", roomId);
    const ws = useWebSocket();
    const { activeConversation } = useAppSelector(state=>state.conversation);
    const { currentUser } = useAppSelector(state=>state.user);
    
    useEffect(() => {
        if (!ws || !activeConversation?._id) return;
    
        safeSend(ws, { type: 'join', conversationId: activeConversation._id as string});
               
      }, [ws, currentUser, activeConversation?._id]);
    const { peerConnection, initConnection, startCall, endCall } = useWebRTC();
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    useEffect(() => {
        initConnection();
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setLocalStream(stream);
        });
    }, []);


    return (
    <div className="p-6">
        <h1>Call Room: {roomId}</h1>
        <VideoPlayer stream={localStream} />
        <CallControls 
            onStart={() => {
                if(!localStream){
                    console.log("localStream media is not ready yet")
                    return;
                }
                if(!ws){
                    console.log("websocket connection is not established yet, Please refresh you page.")
                    return;
                }
                               
                startCall(ws, roomId as string, currentUser?._id as string, localStream);
            }}
        onEnd={() => {
            if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            }
            endCall();
            // Optionally navigate away or show a message
        }}
        />
    </div>
    );
    }
