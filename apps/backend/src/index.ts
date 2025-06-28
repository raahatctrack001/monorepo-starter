import { databaseConnection } from '@repo/database';
import dotenv from 'dotenv';
import app from './app';
import { ConversationWebSocketServer } from './websockets/servers/conversation.websocket';

import path from 'path';

// Try multiple dotenv loading strategies for monorepo
dotenv.config(); // Load from current directory
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // App level
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Root level

console.log('Dotenv loaded from multiple paths');
console.log('MONGODB_CONNECTION_STRING:', process.env.MONGODB_CONNECTION_STRING ? 'SET' : 'NOT SET');
const startServer = async () => {
    try {
        console.log("starting server ...")
        const connectionInstance = await databaseConnection();
        if (connectionInstance) {
            const port = process.env.PORT || 5000;
            // console.log(connectionInstance)
            console.log(`✅ MongoDB connected: ${connectionInstance.host}`);


            const server = app.listen(port, () => {
                console.log(`🚀HTTP Server is running on port ${port}`);
            });
            
            ConversationWebSocketServer.initialize(server);
            return server;
        }
    } catch (error) {
        console.error("❌ Database connection failed, retrying in 5 seconds...", error);
        setTimeout(startServer, 5000);
    }
};

// Start the server
startServer();