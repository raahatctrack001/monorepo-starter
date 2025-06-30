import axios from "axios";
import { INotification } from "@repo/database";

export const sendWhatsappMessage = async (notification: INotification) => {
  await axios.post("https://api.whatsapp.service/send", notification);
};

export const sendSmsMessage = async (notification: INotification) => {
  await axios.post("https://api.sms.service/send", notification);
};

export const sendEmail = async (notification: INotification) => {
  await axios.post("https://api.email.service/send", notification);
};
