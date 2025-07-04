
// src/consumers/smsConsumer.ts
import { INotification } from '@repo/database';
import { kafka, topics } from '@repo/kafka';
import { sendSmsMessage } from '../services/delivery.service';

const consumer = kafka.consumer({ groupId: 'sms_group' });

export const startSmsConsumer = async () => {
  console.log("start sms consumer")

  await consumer.connect();
  await consumer.subscribe({ topic: topics.sms });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const notification = JSON.parse(message.value!.toString()) as INotification;
      await sendSmsMessage(notification);
    },
  });
  console.log("end sms consumer ")

};