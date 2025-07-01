import { INotification } from '@repo/database';
import { kafka } from "../config/kafka";

export const producer = kafka.producer();

export const produceNotification = async (notification: INotification) => {
  console.log("✅ Producer connected and notification received", notification);
  await producer.connect();
  await producer.send({
    topic: "notifications",
    messages: [
      { value: JSON.stringify(notification) },
    ],
  });
  console.log("✅ Message sent");
  await producer.disconnect();
};
