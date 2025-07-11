import { INotification } from '@repo/database';

import { kafka, topics } from '@repo/kafka';
import { welcomeEmailHTML } from '../../utils/email-templates/welcome.email';
import { sendEmail } from '../../services/email.service';

const consumer = kafka.consumer({ groupId: 'email_high_group' });

export const startEmailHighConsumer = async () => {
  console.log("start email consumer for high priority")
  await consumer.connect();
  await consumer.subscribe({ topic: topics.emailHigh });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const notificationDetail = JSON.parse(message.value!.toString());
      const { notification, user } = notificationDetail;

      console.log("notification for high email is here!", notification)
      const html = welcomeEmailHTML(user?.username);
      const emailResponse = await sendEmail(user?.email, "test subject", html);
      console.log("email resposne", emailResponse);
    },
  });
  console.log("end email consumer for high priority")

};
