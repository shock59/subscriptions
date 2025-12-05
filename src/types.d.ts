type FullSubscriptionData = import("$lib/server/db/schema").Subscription & {
  youtubeId: string;
  name: string;
  videos: Video[];
};

type Video = {
  id: string;
  title: string;
  link: string;
  published?: Date;
};
