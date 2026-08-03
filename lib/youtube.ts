export function getYouTubeThumbnail(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (!match) return null;
  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
}
