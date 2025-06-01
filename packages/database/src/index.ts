import { databaseConnection } from "./mongodb.connection";
import User, { IUser } from "./models/user/user.model";
import Otp from "./models/user/otp.model";

export { databaseConnection, User, IUser, Otp }
