const conversationConstant = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/conversation`;
const withPrefix = (path: string) => `${conversationConstant}${path}`;

export const conversationApi = {
  // 1️⃣ Create conversation
  createConversation: (creatorId: string) => withPrefix(`/create-conversation/${creatorId}`),

  // 2️⃣ Get all conversations for user
  getAllConversations: (userId: string) => withPrefix(`/get-all-conversation/${userId}`),

  // 3️⃣ Single conversation by ID
  getConversationById: (id: string) => withPrefix(`/${id}`),
  updateConversation: (id: string) => withPrefix(`/${id}`),
  deleteConversation: (id: string) => withPrefix(`/${id}`),

  // 4️⃣ Participants management
  addParticipant: (id: string) => withPrefix(`/${id}/participants`),
  removeParticipant: (id: string, userId: string) => withPrefix(`/${id}/participants/${userId}`),

  // 5️⃣ Group info update
  setGroupInfo: (id: string) => withPrefix(`/${id}/group-info`),

  // 6️⃣ Last message update
  updateLastMessage: (id: string) => withPrefix(`/${id}/last-message`),

  // 7️⃣ Pin message
  pinMessage: (id: string) => withPrefix(`/${id}/pin-message`),

  // 8️⃣ Mute conversation
  muteConversation: (id: string) => withPrefix(`/${id}/mute`),

  // 9️⃣ Archive / Unarchive
  archiveConversation: (id: string) => withPrefix(`/${id}/archive`),
  unarchiveConversation: (id: string) => withPrefix(`/${id}/unarchive`),

  // 🔟 Custom theme
  setCustomTheme: (id: string) => withPrefix(`/${id}/custom-theme`),

  // 1️⃣1️⃣ Custom nickname
  setCustomNickname: (id: string) => withPrefix(`/${id}/custom-nickname`),

  // 1️⃣2️⃣ Block / Unblock user
  blockUser: (id: string, userId: string) => withPrefix(`/${id}/block/${userId}`),
  unblockUser: (id: string, userId: string) => withPrefix(`/${id}/unblock/${userId}`),

  // 1️⃣3️⃣ Report conversation
  reportConversation: (id: string) => withPrefix(`/${id}/report`),

  // 1️⃣4️⃣ Typing status
  updateTypingStatus: (id: string) => withPrefix(`/${id}/typing-status`),

  // 1️⃣5️⃣ Unread message count
  getUnreadCount: (id: string) => withPrefix(`/${id}/unread-count`),

  // 1️⃣6️⃣ Mark as read
  markAsRead: (id: string) => withPrefix(`/${id}/mark-as-read`),

  // 1️⃣7️⃣ Schedule message
  scheduleMessage: (id: string) => withPrefix(`/${id}/schedule-message`),

  // 1️⃣8️⃣ Activity logs
  getActivityLogs: (id: string) => withPrefix(`/${id}/activity-logs`),

  // 1️⃣9️⃣ Increment message & attachment count
  incrementMessagesCount: (id: string) => withPrefix(`/${id}/increment-messages-count`),
  incrementAttachmentsCount: (id: string) => withPrefix(`/${id}/increment-attachments-count`),

  // 2️⃣0️⃣ Update custom order
  updateCustomOrder: (id: string) => withPrefix(`/${id}/custom-order`),
};
