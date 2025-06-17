
import { databaseConnection } from "./mongodb.connection";
import User, { IUser } from "./models/user/user.model";
import Otp, { IOtp } from "./models/user/otp.model";
import Conversation, { IConversation } from "./models/communication/conversation.model";
import Message, { IMessage } from "./models/communication/message.model";

export { databaseConnection }; //export database connection logic
export { IUser, IOtp, IConversation, IMessage }; //export types if needed
export { 
    User, 
    Otp, 
    Conversation,
    Message
}; //export database models;
