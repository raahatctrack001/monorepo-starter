import mongoose, { Connection } from "mongoose";
import dotenv from 'dotenv'

dotenv.config({
    path: "./.env"
})
export const databaseConnection = async (): Promise<Connection | void> => {
    // console.log("mongodb connection url from mongodb.connection.ts", process.env.MONGODB_CONNECTION_STRING)
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
        return connectionInstance.connection;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        setTimeout(databaseConnection, 5000);
    }
};