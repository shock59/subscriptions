import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export async function isUsernameTaken(username: string) {
  const results = await db
    .select()
    .from(table.user)
    .where(eq(table.user.username, username));
  const existingUser = results.at(0);
  return !!existingUser;
}
