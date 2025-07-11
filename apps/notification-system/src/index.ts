import { databaseConnection } from '@repo/database';
import dotenv from 'dotenv';
import express from "express";
import path from 'path';

import { startEmailHighConsumer } from "./consumers/priorityEmail/email.high.consumer";
import { startEmailLowConsumer } from "./consumers/priorityEmail/email.low.consumer";
import { startEmailMediumConsumer } from "./consumers/priorityEmail/email.normal.consumer";
import { startNotificationConsumer } from "./consumers/notification.consumer";
import { startSmsConsumer } from "./consumers/sms.consumer";
import { startWhatsappConsumer } from "./consumers/whatsapp.consumer";


// Try multiple dotenv loading strategies for monorepo
dotenv.config(); // Load from current directory
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // App level
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Root level

console.log('Dotenv loaded from multiple paths');
console.log('MONGODB_CONNECTION_STRING:', process.env.MONGODB_CONNECTION_STRING ? 'SET' : 'NOT SET');
const startServer = async () => {
    try {
        console.log("starting server at notification system ...")
        const connectionInstance = await databaseConnection();
        if (connectionInstance) {
            const port = process.env.PORT || 5000;
            // console.log(connectionInstance)
            console.log(`✅ MongoDB connected at notification system: ${connectionInstance.host}`);

            const app = express();
            const server = app.listen(port, () => {
                console.log(`🚀HTTP Server is running on port for notification system ${port}`);
            });
            
            return server;
        }
    } catch (error) {
        console.error("❌ Database connection failed at notification system, retrying in 5 seconds...", error);
        setTimeout(startServer, 5000);
    }
};

// Start the server
startServer();

(async () => {
  await Promise.all([
    startNotificationConsumer(),
    startWhatsappConsumer(),
    startEmailHighConsumer(),
    startEmailLowConsumer(),
    startEmailMediumConsumer(),
    startSmsConsumer(),
  ]);
})();


