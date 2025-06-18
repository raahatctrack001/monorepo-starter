// lib/mockData.js
export interface User {
  id: string;
  name: string;
  profilePic: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export const users:User[] = [
  {
    id: "u1",
    name: "Raahat Khan",
    profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
    isOnline: true,
  },
  {
    id: "u2",
    name: "Sarah Mehra",
    profilePic: "https://randomuser.me/api/portraits/women/45.jpg",
    isOnline: false,
  },
];

export const messages:Message[] = [
  {
    id: "m1",
    senderId: "u1",
    receiverId: "u2",
    content: "Hey, how's your day going?",
    timestamp: "10:45 AM",
  },
  {
    id: "m2",
    senderId: "u2",
    receiverId: "u1",
    content: "Pretty good! Working on a new project.",
    timestamp: "10:47 AM",
  },
];
