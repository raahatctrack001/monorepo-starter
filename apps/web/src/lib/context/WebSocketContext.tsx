import { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { safeSend } from './safeSend';
import { updateConversation } from '../store/slices/conversation.slice';
import { addConversationMessages, addMessageToConversation, markMessageAsDeliveredOrRead } from '../store/slices/message.slice';
import { setTyping, setUserOffline, setUserOnline, stopTyping, updateWebSocketConnectedStatus } from '../store/slices/status.slice';
import { markMessageAsDelivered } from '../services/message.service';
import { useWebRTC } from './WebRTCContext';
import { addIceCandidate, callAnswer, callOffer, fetchConversationMessage, markDelivered, updateOnlineStatus } from './services';


const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [conversationId, setConversationId] = useState<string>("");
  const { activeConversation } = useAppSelector(state=>state.conversation)
  const { currentUser } = useAppSelector(state=>state.user);
  const dispatch = useAppDispatch();

  const { peerConnection, initConnection, getOrCreatePeerConnection } = useWebRTC();

  useEffect(()=>{
    setConversationId(activeConversation?._id as string)
  }, [activeConversation])

  useEffect(() => {
    const url = "wss://monorepo-starter-0iuu.onrender.com"
    
    // process.env.NEXT_PUBLIC_NODE_ENV === "development" ?  
    //             process.env.NEXT_PUBLIC_WEBSOCKET_URL:
    //             process.env.NEXT_PUBLIC_WEBSOCKET_URL_PRODUCTION;    

    console.log("websocket url", url)
    if (!url) {
      console.error('WebSocket url is not configured');
      return;
    }

    const ws = new WebSocket(url); //client joined: a customer came to the cafe i.e. websocketserver
    
    ws.onopen = () => {
      console.log('Connected to WebSocket');
      dispatch(updateWebSocketConnectedStatus({isConnected: true}))
      setSocket(ws);
    };

    ws.onmessage = async (event) => {
      console.log("context data", event.data);
      const data = JSON.parse(event.data);
      console.log("parsed context data", data);

      const { conversationId, userId, messageId, message, reaction } = data
      switch (data.type) {
          case "message":        
            if(message?.conversation && message?.message){       
                markDelivered(message.message, message.conversation, currentUser?._id as string, dispatch);    
            }
            break;
          case "conversation-message":
            fetchConversationMessage(data.conversationId, data.messages, dispatch, currentUser?._id as string);
            
            console.log("dispatched: convesation message", data); 
            break;
          // case 'unseen-message': 
          //   console.log("unseen message data", data);
          //   break;
          case 'status':
              updateOnlineStatus(data.isOnline, data.userId, dispatch, data.timestamp ); 
            break;
          case "typing":
            console.log("online data", data)
              dispatch(setTyping({ conversationId: data.conversationId, userId: data.userId }));
              break;
          case "stopTyping":
              dispatch(stopTyping({ conversationId: data.conversationId, userId: data.userId }));
              break;

            case "delivered":
              console.log("message delivered from context", data)
              dispatch(markMessageAsDeliveredOrRead({conversationId: data.conversationId, message: data.message}));
              break;
            case "read":
              console.log("read wala data agya: ", data);
              dispatch(markMessageAsDeliveredOrRead({conversationId: data.conversationId, message: data.message}));

              break;
            case "call:offer":
              callOffer(
                peerConnection, 
                data, 
                currentUser?._id as string,  
                data.conversationId, 
                initConnection, 
                getOrCreatePeerConnection,
                ws, 
              )
              break;
          case "call:answer":
            if(peerConnection)
              callAnswer(data, currentUser?._id as string, peerConnection);
            else{
              console.log("No peerconnection is found")
            }
            break;
          case "call:ice-candidate":
            if(peerConnection)
              addIceCandidate(data, currentUser?._id as string, peerConnection);
            else{
              console.log("No peerconnection is found")
            }
            break;

          // case "reaction":
          //   dispatch(addReaction(data.messageId, data.reaction));
          //   break;
          // case "remove-message":
          //   dispatch(removeMessage(data.messageId));
          //   break;
          // other cases
        }
  };

    
    ws.onclose = (event) => {
      console.log('WebSocket connection closed', event.reason);
      setSocket(null);
      dispatch(updateWebSocketConnectedStatus({isConnected: false}))
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setSocket(null);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close(); //client exited
        dispatch(updateWebSocketConnectedStatus({isConnected: false}))

      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  // Remove the error throwing - just return the context (null is valid)
  return context;
};


// {
//   type: 'message', 
//   conversationId: '68543694c4ece9bc8393ffde', 
//   message: {
//     type:"delivered",
//     conversationId:"68543694c4ec…c1ca4a96",
//     timestamp:"2025-06-24T07:51:40.681Z"}, 
//   timestamp: '2025-06-24T07:51:40.682Z'
// }