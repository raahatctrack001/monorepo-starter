"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.produceNotification = void 0;
const kafka_1 = require("../config/kafka");
const producer = kafka_1.kafka.producer();
const produceNotification = (notification) => __awaiter(void 0, void 0, void 0, function* () {
    yield producer.connect();
    yield producer.send({
        topic: kafka_1.topics.notification,
        messages: [{ value: JSON.stringify(notification) }],
    });
    yield producer.disconnect();
});
exports.produceNotification = produceNotification;
