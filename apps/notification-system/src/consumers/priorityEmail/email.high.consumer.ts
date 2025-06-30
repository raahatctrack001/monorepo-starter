import { INotification } from '@repo/database';

import { sendEmail } from '../../services/delivery.service';
import { kafka, topics } from '@repo/kafka';

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
