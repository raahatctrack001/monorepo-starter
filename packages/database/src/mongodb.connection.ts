import mongoose, { Connection } from "mongoose";
import dotenv from 'dotenv'
import path from 'path';

// Try multiple dotenv loading strategies for monorepo
dotenv.config(); // Load from current directory
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // App level
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Root level

console.log('Dotenv loaded from multiple paths');
console.log('MONGODB_CONNECTION_STRING:', process.env.MONGODB_CONNECTION_STRING ? 'SET' : 'NOT SET');
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