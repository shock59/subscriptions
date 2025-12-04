import Parser from "rss-parser";
const parser = new Parser();

export default async function getYoutubeFeed(
  youtubeId: string,
): Promise<[string, Video[]]> {
  try {
    const feed = await parser.parseURL(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${youtubeId}`,
    );

    const videos = feed.items.map((item) => ({
      id:
        (item.link?.match(/(?<=youtube.com\/(watch\?v=)|(shorts\/)).*/) ?? [
          null,
        ])[0] ?? "unknown",
      title: item.title ?? "Video",
      link:
        item.link ?? feed.link ?? "https://youtube.com/channel/${youtubeId}",
      published: item.pubDate ? new Date(item.pubDate) : undefined,
    }));

    return [feed.title ?? youtubeId, videos];
  } catch {
    return [youtubeId, []];
  }
}
