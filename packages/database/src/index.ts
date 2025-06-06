import { databaseConnection } from "./mongodb.connection";
import User, { IUser } from "./models/user/user.model";
import Otp from "./models/user/otp.model";
import Conversation from "./models/chat/conversation.model";

export { databaseConnection }; //export database connection logic
export { IUser }; //export types if needed
export { 
    User, 
    Otp, 
    Conversation 
}; //export database models;
