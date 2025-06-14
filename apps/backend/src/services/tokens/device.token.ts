export default async function generateDeviceToken() {
  const userAgent = navigator.userAgent;
//   const platform = navigator.platform;
  const resolution = `${window.screen.width}x${window.screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language;

  const rawData = `${userAgent}-${resolution}-${timezone}-${language}`;
  
  // Simple SHA-256 hash using Web Crypto API
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(rawData))
    .then(buffer => {
      return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    });
}
