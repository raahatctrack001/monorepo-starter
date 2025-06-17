
import { databaseConnection } from "./mongodb.connection";
import User, { IUser } from "./models/user/user.model";
import Otp, { IOtp } from "./models/user/otp.model";
import Conversation, { IConversation } from "./models/communication/conversation.model";
import Message, { IMessage } from "./models/communication/message.model";
import Group, { IGroup } from "./models/communication/group.model";

//Export database connection login
export { databaseConnection }; 

//export types if needed in another part of project
export { 
    IUser, 
    IOtp, 
    IConversation, 
    IMessage, 
    IGroup 
};

//export database models for backend controller logic
export { 
    User, 
    Otp, 
    Conversation,
    Message,
    Group,
};
