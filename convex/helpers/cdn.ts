const CDN_BASE_URL =
  process.env.CONVEX_ENV === "development"
    ? "https://pub-d90268f86a134686a1cf1d990af7b506.r2.dev"
    : "https://cdn.htmlpix.com";

export function cdnUrl(key: string): string {
  return `${CDN_BASE_URL}/${key}`;
}
