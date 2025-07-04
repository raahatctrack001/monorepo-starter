import { User } from "@repo/database";

export type NotificationPreference = {
  whatsapp: boolean,
  email: boolean,
  sms: boolean,
}
export const getUserPreferences = async (userId: string): Promise<NotificationPreference | undefined> => {
    try {
        if(!userId){
            throw new Error('userId is required')
        }
        const user = await User.findById(userId).lean();
        console.log("user notification preference", user)
        if(!user){
            throw new Error("Failed to fetch user details from database")
        }
        return user.notificaionPreference;
    } catch (error) {
        console.log("error getting user details for notification", error);
    }
};
