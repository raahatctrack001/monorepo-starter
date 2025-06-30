import { INotification } from "@repo/database";
import { kafka, topics } from "@repo/kafka";
import { sendEmail } from "../../services/delivery.service";


const consumer = kafka.consumer({ groupId: 'email_medium_group' });

export const startEmailMediumConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: topics.emailMedium });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const notification = JSON.parse(message.value!.toString()) as INotification;
      await sendEmail(notification);
    },
  });
};
