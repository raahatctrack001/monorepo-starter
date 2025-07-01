
import * as dotenv from "dotenv";
import path from "path";

dotenv.config(); // Load from current directory
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // App level
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Root level


export const env = {
  kafkaBroker: process.env.KAFKA_BROKER!,
};

console.log("env", env);
