import { User } from "@repo/database";

export type NotificationPreference = {
  whatsapp: boolean,
  email: boolean,
  sms: boolean,
}
export const getUserPreferences = async (userId: string): Promise<NotificationPreference | undefined> => {
    try {
        const user = await User.findById(userId).lean();
        if(!user){
            throw new Error("Failed to fetch user details from database")
        }
        return user.notificaionPreference;
    } catch (error) {
        console.log("error getting user details", error);
    }
};
