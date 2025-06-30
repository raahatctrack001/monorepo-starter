"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topics = exports.kafka = void 0;
const kafkajs_1 = require("kafkajs");
const env_1 = require("./env");
exports.kafka = new kafkajs_1.Kafka({
    clientId: "notification-service",
    brokers: [env_1.env.kafkaBroker],
});
exports.topics = {
    notification: "notifications",
    whatsapp: "whatsapp_notifications",
    sms: "sms_notifications",
    emailHigh: "email_high_priority",
    emailMedium: "email_medium_priority",
    emailLow: "email_low_priority",
};
