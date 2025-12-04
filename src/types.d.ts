type SubscriptionData = {
  name: string;
  videos: Video[];
};

type Video = {
  id: string;
  title: string;
  link: string;
  published?: Date;
};
