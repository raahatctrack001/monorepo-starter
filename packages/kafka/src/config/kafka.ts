import { Kafka } from "kafkajs";
import { env } from "./env";

export const kafka = new Kafka({
  clientId: "notification-service",
  brokers: [env.kafkaBroker, "localhost:9092"],
});
  
export interface ITopic {
  notification: string,
  whatsapp: string,
  sms: string, 
  emailHigh: string,
  emailNormal: string,
  emailLow: string,
}

export const topics: Readonly<ITopic> = {
  notification: "notifications",
  whatsapp: "whatsapp_notifications",
  sms: "sms_notifications",
  emailHigh: "email_high_priority",
  emailNormal: "email_normal_priority",
  emailLow: "email_low_priority",
};

