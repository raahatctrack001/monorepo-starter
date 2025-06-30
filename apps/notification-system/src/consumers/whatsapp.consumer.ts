import { kafka, topics } from "../config/kafka";
import { INotification } from "@repo/database";
import { sendWhatsappMessage } from "../services/delivery.service";

const consumer = kafka.consumer({ groupId: "whatsapp_group" });

export const startWhatsappConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: topics.whatsapp });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const notification = JSON.parse(message.value!.toString()) as INotification;
      await sendWhatsappMessage(notification);
    },
  });
};
