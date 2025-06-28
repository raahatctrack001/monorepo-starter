import mongoose, { Connection } from "mongoose";
import dotenv from 'dotenv'

dotenv.config({
    path: "./.env"
})
export const databaseConnection = async (): Promise<Connection | void> => {
    // console.log("mongodb connection url from mongodb.connection.ts", process.env.MONGODB_CONNECTION_STRING)
    try {
        const remoteConnectionString = process.env.MONGODB_CONNECTION_STRING;
        // const localConnectionString = process.env.MONGODB_CONNECTION_STRING_DOCKER;
        // const connectionString = process.env.NODE_ENV === 'production' ? remoteConnectionString : localConnectionString
        // console.log(connectionString)
        
        const connectionInstance = await mongoose.connect(remoteConnectionString as string);
        return connectionInstance.connection;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        setTimeout(databaseConnection, 5000);
    }
};