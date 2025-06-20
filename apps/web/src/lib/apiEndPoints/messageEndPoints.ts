const messageConstant = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/message`;
const withPrefix = (path: string) => `${messageConstant}${path}`;

export const messageApi = {
  // 1️⃣ Create Message
  createMessage: (conversationId: string, creatorId: string) =>
    withPrefix(`/create-message/${conversationId}/${creatorId}`),

  // 2️⃣ Get Messages by Conversation
  getMessagesByConversation: (conversationId: string, userId: string) =>
    withPrefix(`/conversation/${conversationId}/${userId}`),

  // 3️⃣ Single Message — Get, Edit, Delete
  getMessageById: (id: string) => withPrefix(`/${id}`),
  editMessage: (id: string) => withPrefix(`/${id}`),
  deleteMessage: (id: string) => withPrefix(`/${id}`),

  // 4️⃣ Pin/Unpin
  pinMessage: (id: string) => withPrefix(`/${id}/pin`),
  unpinMessage: (id: string) => withPrefix(`/${id}/unpin`),

  // 5️⃣ Reactions
  reactToMessage: (id: string) => withPrefix(`/${id}/react`),
  removeReaction: (id: string) => withPrefix(`/${id}/remove-reaction`),

  // 6️⃣ Delivery / Seen Status
  markDelivered: (id: string) => withPrefix(`/${id}/delivered`),
  getDeliveredStatus: (id: string) => withPrefix(`/${id}/delivered`),
  markSeen: (id: string) => withPrefix(`/${id}/seen`),
  getSeenStatus: (id: string) => withPrefix(`/${id}/seen`),

  // 7️⃣ Forward & Reply
  forwardMessage: (id: string) => withPrefix(`/${id}/forward`),
  replyToMessage: (id: string) => withPrefix(`/${id}/reply`),

  // 8️⃣ Schedule Message
  scheduleMessage: (id: string) => withPrefix(`/${id}/schedule`),
  cancelScheduledMessage: (id: string) => withPrefix(`/${id}/schedule`),
  getScheduledMessages: (conversationId: string) =>
    withPrefix(`/scheduled/${conversationId}`),

  // 9️⃣ Delete for User / Everyone
  deleteForUser: (id: string, userId: string) =>
    withPrefix(`/${id}/delete-for-user/${userId}`),
  deleteForEveryone: (id: string) => withPrefix(`/${id}/delete-for-everyone`),

  // 🔟 Attachments
  addAttachment: (id: string) => withPrefix(`/${id}/attachment`),
  getAttachments: (id: string) => withPrefix(`/${id}/attachments`),

  // 1️⃣1️⃣ Set Priority
  setPriority: (id: string) => withPrefix(`/${id}/priority`),

  // 1️⃣2️⃣ System Events
  addSystemEvent: () => withPrefix(`/system-event`),
  getSystemEvents: (conversationId: string) =>
    withPrefix(`/system-events/${conversationId}`),

  // 1️⃣3️⃣ Get Conversation Messages with Filters
  getConversationMessagesWithFilters: (conversationId: string) =>
    withPrefix(`/conversation/${conversationId}/filtered`),
};
