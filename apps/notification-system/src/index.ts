import { startEmailHighConsumer } from "./consumers/priorityEmail/email.high.consumer";
import { startEmailLowConsumer } from "./consumers/priorityEmail/email.low.consumer";
import { startEmailMediumConsumer } from "./consumers/priorityEmail/email.normal.consumer";
import { startNotificationConsumer } from "./consumers/notification.consumer";
import { startSmsConsumer } from "./consumers/sms.consumer";
import { startWhatsappConsumer } from "./consumers/whatsapp.consumer";

(async () => {
  await Promise.all([
    startNotificationConsumer(),
    startWhatsappConsumer(),
    startEmailHighConsumer(),
    startEmailLowConsumer(),
    startEmailMediumConsumer(),
    startSmsConsumer(),
  ]);
})();
