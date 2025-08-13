export function extractAssetsKeyFromPublicUrl(url: string): string {
  try {
    const u = new URL(url);
    const marker = '/storage/v1/object/public/assets/';
    const i = u.pathname.indexOf(marker);
    if (i === -1) return '';
    return decodeURIComponent(u.pathname.slice(i + marker.length));
  } catch {
    return '';
  }
}
