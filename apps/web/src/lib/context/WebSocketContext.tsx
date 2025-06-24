import { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { safeSend } from './safeSend';
import { updateConversation } from '../store/slices/conversation.slice';
import { addMessageToConversation } from '../store/slices/message.slice';
import { setTyping, setUserOffline, setUserOnline, stopTyping } from '../store/slices/status.slice';

const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [conversationId, setConversationId] = useState<string>("");
  const { activeConversation } = useAppSelector(state=>state.conversation)
  const { currentUser } = useAppSelector(state=>state.user);
  const dispatch = useAppDispatch();

  useEffect(()=>{
    setConversationId(activeConversation?._id as string)
  }, [activeConversation])

  useEffect(() => {
    const port = process.env.NEXT_PUBLIC_WEBSOCKET_PORT;
    
    if (!port) {
      console.error('WebSocket port not configured');
      return;
    }

    const ws = new WebSocket(`ws://localhost:${port}`); //client joined: a customer came to the cafe i.e. websocketserver
    
    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("context data", data);
  const { conversationId, userId, messageId, message, reaction } = data
  switch (data.type) {
      case "message":        
        if(message?.conversation && message?.message){
          dispatch(updateConversation(message?.conversation))
          dispatch(addMessageToConversation({
            conversationId: data.conversationId,
            messages: [message?.message]
          }))
        }
        // console.log("dispatched but from socket context")
        break;
        case 'status': 
        if(data.isOnline)
          dispatch(setUserOnline({userId:data.userId, timestamp: data.timestamp}))
        else
        dispatch(setUserOffline({userId: data.userId, timestamp: data.timestamp}))
      break;
      case "typing":
        console.log("online data", data)
          dispatch(setTyping({ conversationId: data.conversationId, userId: data.userId }));
          break;
      case "stopTyping":
          dispatch(stopTyping({ conversationId: data.conversationId, userId: data.userId }));
          break;

        case "delivered":
          console.log("message delivered", data)
          // dispatch(markDelivered(data.messageId));
        break;
      // case "read":
      //   dispatch(markRead(data.messageId));
      //   break;
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
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setSocket(null);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close(); //client exited
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