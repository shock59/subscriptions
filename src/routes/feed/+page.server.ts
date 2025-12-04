import { fail, redirect, type Actions } from "@sveltejs/kit";
import { getRequestEvent } from "$app/server";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import generateId from "$lib/server/generateId";
import { channelId } from "@gonetone/get-youtube-id-by-url";
import getYoutubeFeed from "$lib/server/getYoutubeFeed";

let user: App.Locals["user"];

export const load: PageServerLoad = async () => {
  user = requireLogin();
  const subscriptions = await getSubscriptions(user.id);
  return { user, subscriptions };
};

export const actions: Actions = {
  addSubscription: async (event) => {
    if (!user) {
      return fail(401);
    }

    const formData = await event.request.formData();
    const youtubeUrl = formData.get("youtube-url");
    if (typeof youtubeUrl !== "string") {
      return fail(400);
    }

    const youtubeId = await channelId(youtubeUrl);

    await addSubscription(user.id, youtubeId);
    return redirect(302, "/feed");
  },
};

function requireLogin() {
  const { locals } = getRequestEvent();

  if (!locals.user) {
    return redirect(302, "/");
  }

  return locals.user;
}

async function getSubscriptions(userId: string): Promise<SubscriptionData[]> {
  const subscriptions = await db
    .select()
    .from(table.subscription)
    .where(eq(table.subscription.userId, userId));

  return await Promise.all(
    subscriptions.map(async (subscription) => {
      const channel = await db
        .select()
        .from(table.channel)
        .where(eq(table.channel.id, subscription.channelId));

      if (!channel[0]) return { name: "???", videos: [] };

      const [name, videos] = await getYoutubeFeed(channel[0].youtubeId);
      return { name, videos };
    }),
  );
}

async function addOrGetChannel(youtubeId: string): Promise<table.Channel> {
  const channels = await db
    .select()
    .from(table.channel)
    .where(eq(table.channel.youtubeId, youtubeId));

  if (channels.length > 0) return channels[0];

  const channel = {
    id: generateId(),
    youtubeId,
  };
  await db.insert(table.channel).values(channel);
  return channel;
}

async function addSubscription(userId: string, youtubeId: string) {
  const channel = await addOrGetChannel(youtubeId);
  const subscription = {
    id: generateId(),
    creationDate: new Date(),
    userId,
    channelId: channel.id,
  };
  await db.insert(table.subscription).values(subscription);
}
