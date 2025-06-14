import ApiError from "../../utils/apiError";

interface DeviceInfo {
  userAgent: string,
  language: string,
  resolution: string,
  timezone: string,
}
export default async function generateDeviceToken(deviceInfo: DeviceInfo) {
  const { userAgent, resolution, timezone, language } = deviceInfo;

  const rawData = `${userAgent}-${resolution}-${timezone}-${language}`;
  const encodedData = new TextEncoder().encode(rawData);
  console.log(rawData, encodedData)
  try {
    const buffer = await crypto.subtle.digest("SHA-256", encodedData);
    const hashArray = Array.from(new Uint8Array(buffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    throw new ApiError(400, "Failed to create device token");
  }
}
