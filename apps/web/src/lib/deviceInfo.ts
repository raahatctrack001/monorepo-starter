export async function getDeviceInfo() {
  const userAgent = navigator.userAgent;
  const language = navigator.language;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const resolution = `${window.screen.width}x${window.screen.height}`;

  // Detect device type
  const width = window.innerWidth;
  let type = 'desktop';
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) type = 'tablet';
  else if (/mobile/i.test(userAgent) || width <= 480) type = 'mobile';
  else if (width > 480 && width <= 1024) type = 'laptop';

  // Detect OS
  let os = 'Unknown';
  if (/Windows/i.test(userAgent)) os = 'Windows';
  else if (/Mac OS/i.test(userAgent)) os = 'macOS';
  else if (/Android/i.test(userAgent)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(userAgent)) os = 'iOS';
  else if (/Linux/i.test(userAgent)) os = 'Linux';

  // Detect browser
  let browser = 'Unknown';
  if (userAgent.includes('Chrome') && !userAgent.includes('Edge') && !userAgent.includes('Edg')) browser = 'Chrome';
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Edg')) browser = 'Edge';
  else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';

  // Generate device token (SHA-256 hash)
  const rawData = `${userAgent}-${resolution}-${timezone}-${language}`;
  const encodedData = new TextEncoder().encode(rawData);
  const buffer = await crypto.subtle.digest("SHA-256", encodedData);
  const hashArray = Array.from(new Uint8Array(buffer));
  const token = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return {
    type,
    os,
    useragent: userAgent,
    language,
    timezone,
    resolution,
    browser,
    token
  };
}
