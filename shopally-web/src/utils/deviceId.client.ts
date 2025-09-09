// utils/deviceId.client.ts
export function getDeviceIdClient(): string | null {
  if (typeof window === "undefined") return null;

  const match = document.cookie.match(/(^| )deviceId=([^;]+)/);
  return match ? match[2] : null;
}
