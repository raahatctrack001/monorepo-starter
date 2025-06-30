import { kafka, topics } from "../config/kafka";
import { INotification } from "@repo/database";

const producer = kafka.producer();

export const produceNotification = async (notification: INotification) => {
  await producer.connect();
  await producer.send({
    topic: topics.notification,
    messages: [{ value: JSON.stringify(notification) }],
  });
  await producer.disconnect();
};
