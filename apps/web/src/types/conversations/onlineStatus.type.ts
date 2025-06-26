export interface IOnlineStatus{
    users: Record<string, { //record<userId, <true, time>>
        isOnline: boolean,
        lastSeen: Date|null,
    }>,
    typingStatus: Record<string, Record<string, boolean>>, //record<conversationId, <userid, true>>
    isConnected: boolean
}