import CryptoJS from "crypto-js";

export function encryptMessage(message: string, key: string): string {
  const ciphertext = CryptoJS.AES.encrypt(message, key).toString();
  return ciphertext;
}

export function decryptMessage(ciphertext: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}
