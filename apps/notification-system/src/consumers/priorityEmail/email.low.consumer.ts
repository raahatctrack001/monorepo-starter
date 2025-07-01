import { INotification } from "@repo/database";
import { kafka, topics } from "@repo/kafka";
import { sendEmail } from "../../services/delivery.service";

const consumer = kafka.consumer({ groupId: 'email_low_group' });

export const startEmailLowConsumer = async () => {
  console.log("start email consumer for low priority")

  await consumer.connect();
  await consumer.subscribe({ topic: topics.emailLow });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const notification = JSON.parse(message.value!.toString()) as INotification;
      await sendEmail(notification);
    },
  });
  console.log("end email consumer for low priority")

};
