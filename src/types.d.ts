type SubscriptionData = {
  name: string;
  videos: Video[];
};

type Video = {
  title: string;
  link: string;
  published?: Date;
};
