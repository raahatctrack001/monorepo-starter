
// src/consumers/smsConsumer.ts
import { INotification } from '@repo/database';
import { kafka, topics } from '../config/kafka';
import { sendSmsMessage } from '../services/delivery.service';

const consumer = kafka.consumer({ groupId: 'sms_group' });

export const startSmsConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: topics.sms });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const notification = JSON.parse(message.value!.toString()) as INotification;
      await sendSmsMessage(notification);
    },
  });
};