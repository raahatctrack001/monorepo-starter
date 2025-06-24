import { Client, MessagePayload } from './../types/type';
import { WebSocketServer, WebSocket } from 'ws';
import { RoomManager } from '../rooms/roomManager.websocket';
import { Server as HttpServer } from 'http';

export class ConversationWebSocketServer {
  private static _instance: ConversationWebSocketServer;
  private wss: WebSocketServer;
  private roomManager: RoomManager;

  //private to avoid direct instantiation
  private constructor(server: HttpServer) { 
    this.wss = new WebSocketServer({ server });
    this.roomManager = new RoomManager();
    this.initialize(); //instance method not the static one.
    console.log('🚀 WebSocket Server is running (attached to HTTP server)');
  }

  /**
   * static initializer, if not instantiated before then do the task else return the created instance
   * @param server http server connected with websocekt
   * @returns singleton instance
   */
  public static initialize(server: HttpServer) { 
    if (!this._instance) {
      this._instance = new ConversationWebSocketServer(server);
    }
    return this._instance;
  }

  /**
   * pubilc getter: get created instance without creating new 
   */
  public static get instance() {
    if (!this._instance) {
      throw new Error('WebSocket Server not initialized. Call initialize(server) first.');
    }
    return this._instance;
  }

  /**
   * initialize the websocket server
   * 
   */
  private initialize() { //only triggers first time when a user comes into chatWindow not after that
    this.wss.on('connection', (ws: WebSocket) => { //ws => client that is connection from frontend
      console.log('New client connected.');

      ws.on('message', (data) => {
        try {
          // console.log("Inside initialze and on message")
          const message = JSON.parse(data.toString());  
          this.handleMessage(ws, message);
        } catch (err) {
          console.error('Error parsing message:', err);
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
      });

      ws.on('error', (err) => console.error('WebSocket error after connection:', err));

      ws.on('close', () => {
        try {
          this.roomManager.removeClientFromAllRooms(ws);
          console.log('Client disconnected.');
        } catch (err) {
          console.error('Error during WebSocket close:', err);
        }
      });
    });

    this.wss.on('error', (err) => console.error('WebSocket Server error:', err));
  }

  /**
   * 
   * @param ws: websocket instance
   * @param payload: message payload sent from client side
   */
  private handleMessage(ws: WebSocket, payload: MessagePayload) {
  console.log("inside handleMessage: payload is:", payload);

  switch (payload.type) {
    case 'join':
      if (payload.conversationId) {        
        this.roomManager.joinRoom(payload.conversationId, ws);
      }
      break;

    case 'message':
      if (payload.conversationId && payload.message) {
        const outboundMessage = JSON.stringify({
          type: 'message',
          conversationId: payload.conversationId,
          sender: payload.message?.message.senderId,
          message: payload.message,
          timestamp: new Date().toISOString(),
        });
        this.roomManager.broadcast(payload.conversationId, outboundMessage, ws);
        console.log("message broadcasted from roomManager.broadcast")
      }
      break;

    case 'online':
      if (payload.userId) {
        this.roomManager.markUserOnline(payload.userId, ws);
        this.roomManager.broadcastStatus(payload.userId, true);
        // console.log("user status marked as online")
      }
      break;

    case 'offline':
      if (payload.userId) {
        this.roomManager.markUserOffline(payload.userId);
        this.roomManager.broadcastStatus(payload.userId, false);
      }
      break;

    case 'typing':
      if (payload.conversationId && payload.userId) {
        this.roomManager.addTypingUser(payload.conversationId, payload.userId);
        const typingNotification = JSON.stringify({
          type: 'typing',
          conversationId: payload.conversationId,
          userId: payload.userId,
        });
        this.roomManager.broadcast(payload.conversationId, typingNotification, ws);
      }
      break;

    case 'stopTyping':
      if (payload.conversationId && payload.userId) {
        this.roomManager.removeTypingUser(payload.conversationId, payload.userId);
        const stopTypingNotification = JSON.stringify({
          type: 'stopTyping',
          conversationId: payload.conversationId,
          userId: payload.userId,
        });
        this.roomManager.broadcast(payload.conversationId, stopTypingNotification, ws);
      }
      break;

    case 'delivered':
      if (payload.messageId && payload.userId) {
        const deliveredNotification = JSON.stringify({
          type: 'delivered',
          messageId: payload.messageId,
          userId: payload.userId,
        });
        this.roomManager.broadcast(payload.conversationId!, deliveredNotification);
      }
      break;

    case 'read':
      if (payload.messageId && payload.userId) {
        const readNotification = JSON.stringify({
          type: 'read',
          messageId: payload.messageId,
          userId: payload.userId,
        });
        this.roomManager.broadcast(payload.conversationId!, readNotification);
      }
      break;

    case 'reaction':
      if (payload.messageId && payload.userId && payload.reaction) {
        const reactionNotification = JSON.stringify({
          type: 'reaction',
          messageId: payload.messageId,
          userId: payload.userId,
          reaction: payload.reaction,
        });
        this.roomManager.broadcast(payload.conversationId!, reactionNotification);
      }
      break;

    case 'remove-message':
      if (payload.messageId) {
        const removalNotification = JSON.stringify({
          type: 'remove-message',
          messageId: payload.messageId,
        });
        this.roomManager.broadcast(payload.conversationId!, removalNotification);
      }
      break;

    default:
      console.warn('Unknown message type:', payload.type);
  }
}


  // Public method for API routes to broadcast programmatically
  public broadcastMessageToRoom(conversationId: string, message: any) {
    const outboundMessage = JSON.stringify({
      type: 'message',
      conversationId,
      message,
      timestamp: new Date().toISOString(),
    });
    // console.log(conversationId, outboundMessage, message)
    this.roomManager.broadcast(conversationId, outboundMessage);
  }  

  public broadcastDeliveredToRoom(conversationId: string, message: any) {
    const data = JSON.parse(message);
    console.log("data delivered wala", data);
    
    const outboundMessage = JSON.stringify(data);
    // console.log(conversationId, outboundMessage, message)
    this.roomManager.broadcast(conversationId, message);
  }  
}
