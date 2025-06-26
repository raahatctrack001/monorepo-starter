import { WebSocket } from 'ws';
import { Client } from '../types/type';

export class RoomManager {
  private rooms: Map<string, Set<Client>>;
  private onlineUsers: Map<string, Client>;
  private typingUsers: Map<string, Set<string>>;

  constructor() {
    this.rooms = new Map();
    this.onlineUsers = new Map();
    this.typingUsers = new Map();
  }

  joinRoom(conversationId: string, client: Client) {
    if (!this.rooms.has(conversationId)) {
      this.rooms.set(conversationId, new Set());
    }
    this.rooms.get(conversationId)!.add(client);
    console.log(`Client joined room ${conversationId}`);
  }

  leaveRoom(conversationId: string, client: Client) {
    if (this.rooms.has(conversationId)) {
      this.rooms.get(conversationId)!.delete(client);
      console.log(`Client left room ${conversationId}`);
      if (this.rooms.get(conversationId)!.size === 0) {
        this.rooms.delete(conversationId);
      }
    }
  }

  broadcast(conversationId: string, message: string, senderClient?: Client) {
    console.log("message broadcasting!")
    const clients = this.rooms.get(conversationId);
    if (!clients) return;
    console.log("gotthe client!")

    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client !== senderClient) {
        client.send(message);
      }
      console.log("sent")
    });
  }

  removeClientFromAllRooms(client: Client) {
    this.rooms.forEach((clients, conversationId) => {
      if (clients.has(client)) {
        clients.delete(client);
        if (clients.size === 0) {
          this.rooms.delete(conversationId);
        }
      }
    });

    // remove from online users too
    this.onlineUsers.forEach((socket, userId) => {
      if (socket === client) {
        this.onlineUsers.delete(userId);
        this.broadcastStatus(userId, false);
      }
    });
  }

  // ✅ mark a user online
  markUserOnline(userId: string, client: Client) {
    this.onlineUsers.set(userId, client);
    console.log(`${userId} is now online.`);
  }

  // ✅ mark a user offline
  markUserOffline(userId: string) {
    this.onlineUsers.delete(userId);
    console.log(`${userId} is now offline.`);
  }

  // ✅ broadcast online/offline status to all users
  broadcastStatus(userId: string, isOnline: boolean) {
    const statusMessage = JSON.stringify({
      type: 'status',
      userId,
      isOnline,
      timestamp: new Date().toISOString(),
    });

    // broadcast to all clients
    this.rooms.forEach(clients => {
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(statusMessage);
        }
      });
    });
  }

  // ✅ add typing user
  addTypingUser(conversationId: string, userId: string) {
    if (!this.typingUsers.has(conversationId)) {
      this.typingUsers.set(conversationId, new Set());
    }
    this.typingUsers.get(conversationId)!.add(userId);
    console.log(`${userId} is typing in ${conversationId}`);
  }

  // ✅ remove typing user
  removeTypingUser(conversationId: string, userId: string) {
    if (this.typingUsers.has(conversationId)) {
      this.typingUsers.get(conversationId)!.delete(userId);
      console.log(`${userId} stopped typing in ${conversationId}`);
      if (this.typingUsers.get(conversationId)!.size === 0) {
        this.typingUsers.delete(conversationId);
      }
    }
  }

  showRooms() {
    this.rooms.forEach((clients, conversationId) => {
      console.log(`Room: ${conversationId} and size: ${clients.size}`);
    });
  }
}
