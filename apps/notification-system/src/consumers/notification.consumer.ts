import { INotification } from "@repo/database";

import { getUserPreferences } from "../services/notification.service";
import { kafka, topics } from "@repo/kafka";

const consumer = kafka.consumer({ groupId: "main_notification_group" });
const producer = kafka.producer();

export const startNotificationConsumer = async () => {
  console.log("start notification consumer")

  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: topics.notification });

  await consumer.run({
    eachMessage: async ({ message }) => {
        const notification = JSON.parse(message.value!.toString()) as INotification;
        const prefs = await getUserPreferences(notification.receiverId.toString());
        console.log(`
          *
          *
          * *
          * *
          * *
          * *
          * *
          * *
          * *
          * *
          * *
          * user preference
          * 
          * 
          * 
          * 
          * 
          * 
          * 
          * 
          * 
          * ` ,prefs)
        if (!prefs){ 
          console.log("failed to fetch user preference")    
          return; //don't return just send notifiation on email only.
        }
        if (prefs.whatsapp) {
          await producer.send({
            topic: topics.whatsapp,
            messages: [{ value: JSON.stringify(notification) }],
          });
        }   
        if (prefs.sms) {
          await producer.send({
            topic: topics.sms,
            messages: [{ value: JSON.stringify(notification) }],
          });
        }   
        if (prefs.email) {
          let emailTopic = topics.emailLow;
          if (notification.priority === "high") emailTopic = topics.emailHigh;
          else if (notification.priority === "normal") emailTopic = topics.emailMedium;

          await producer.send({
            topic: emailTopic,
            messages: [{ value: JSON.stringify(notification) }],
          });
        }
    },
  });
  console.log("start notification consumer for high priority")

};
