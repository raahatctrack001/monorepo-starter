import * as dotenv from "dotenv";

dotenv.config();

export const env = {
  kafkaBroker: process.env.KAFKA_BROKER!,
  mongoUri: process.env.MONGO_URI!,
};
