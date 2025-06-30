import { startNotificationConsumer } from "./consumers/notification.consumer";
import { startWhatsappConsumer } from "./consumers/whatsapp.consumer";

(async () => {
  await Promise.all([
    startNotificationConsumer(),
    startWhatsappConsumer(),
    // similarly startSmsConsumer, startEmailConsumer etc.
  ]);
})();
