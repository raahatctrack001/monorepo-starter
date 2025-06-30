import { INotification } from '@repo/database';
import { kafka, topics } from '../../config/kafka';
import { sendEmail } from '../../services/delivery.service';

const consumer = kafka.consumer({ groupId: 'email_high_group' });

export const startEmailHighConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: topics.emailHigh });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const notification = JSON.parse(message.value!.toString()) as INotification;
      await sendEmail(notification);
    },
  });
};
