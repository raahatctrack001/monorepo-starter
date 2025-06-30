import { kafka } from '../index'
export const producer = kafka.producer();

export const produceNotification = async (notification: Notification) => {
  await producer.connect();
  await producer.send({
    topic: 'notifications',
    messages: [{ value: JSON.stringify(notification) }],
  });
  await producer.disconnect();
};