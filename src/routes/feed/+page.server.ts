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
    let youtubeUrl = formData.get("youtube-url");
    if (typeof youtubeUrl !== "string") {
      return fail(400);
    }
    youtubeUrl = youtubeUrl.trim();

    if (youtubeUrl.length == 0) {
      return fail(400, { message: "Enter a valid channel URL" });
    }

    let youtubeId;
    try {
      youtubeId = await channelId(youtubeUrl);
    } catch {
      return fail(400, { message: "Enter a valid channel URL" });
    }

    await addSubscription(user.id, youtubeId);
    return { subscriptions: await getSubscriptions(user.id) };
  },

  removeSubscription: async (event) => {
    if (!user) {
      return fail(401);
    }

    const formData = await event.request.formData();
    let subscriptionId = formData.get("subscription-id");
    if (typeof subscriptionId !== "string") {
      return fail(400);
    }

    const results = await db
      .select()
      .from(table.subscription)
      .where(eq(table.subscription.id, subscriptionId));
    if (results.length == 0) {
      return fail(404);
    }

    const subscription = results[0];
    if (subscription.userId != user.id) {
      return fail(403);
    }

    console.log(subscription.id);

    await db
      .delete(table.subscription)
      .where(eq(table.subscription.id, subscription.id));
  },
};

function requireLogin() {
  const { locals } = getRequestEvent();

  if (!locals.user) {
    return redirect(302, "/");
  }

  return locals.user;
}

async function getSubscriptions(
  userId: string,
): Promise<FullSubscriptionData[]> {
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

      if (!channel[0])
        return { ...subscription, youtubeId: "???", name: "???", videos: [] };

      const youtubeId = channel[0].youtubeId;
      const [name, videos] = await getYoutubeFeed(youtubeId);
      return { ...subscription, youtubeId, name, videos };
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
