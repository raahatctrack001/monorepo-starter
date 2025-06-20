export const getMessageTypeFromMime = (mimetype: string): string => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "audio";
  if (mimetype === "application/pdf") return "document";
  if (mimetype.startsWith("application/")) return "document";

  // fallback
  return "document";
};
