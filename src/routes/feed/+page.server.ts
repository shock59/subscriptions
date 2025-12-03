import { redirect } from "@sveltejs/kit";
import { getRequestEvent } from "$app/server";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async () => {
  const user = requireLogin();
  const subscriptions = await getSubscriptions(user.id);
  return { user, subscriptions };
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

      if (!channel[0]) return { youtubeName: "???" };
      return { youtubeName: channel[0].youtubeId };
    }),
  );
}
