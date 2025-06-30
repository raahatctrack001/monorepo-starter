// src/consumers/emailConsumer.ts
import { INotification } from '@repo/database';
import { kafka, topics } from '../config/kafka';
import { sendEmail } from '../services/delivery.service';

const consumer = kafka.consumer({ groupId: 'email_group' });

export const startEmailConsumers = async () => {
  await consumer.connect();
  await consumer.subscribe({ topics: [topics.emailHigh, topics.emailMedium, topics.emailLow] });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const notification = JSON.parse(message.value!.toString()) as INotification;
      await sendEmail(notification);
    },
  });
};