import mongoose, { Connection } from "mongoose";
import dotenv from 'dotenv'
import path from "path";

dotenv.config({ path: path.resolve(__dirname, '../.env') });
export const databaseConnection = async (): Promise<Connection | void> => {
    // console.log("mongodb connection url from mongodb.connection.ts", process.env.MONGODB_CONNECTION_STRING)
    try  {                   
        const remoteConnectionString = process.env.MONGODB_CONNECTION_STRING;
        const localConnectionString = process.env.MONGODB_CONNECTION_STRING_DOCKER;
        const connectionString = process.env.NODE_ENV !== 'production' ? remoteConnectionString : localConnectionString
        console.log('All environment variables:', Object.keys(process.env));
        console.log('MongoDB string:', process.env.MONGODB_CONNECTION_STRING);
        console.log('MongoDB string length:', process.env.MONGODB_CONNECTION_STRING?.length);
                
        const connectionInstance = await mongoose.connect(remoteConnectionString);
        return connectionInstance.connection;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        setTimeout(databaseConnection, 5000);
    }
};