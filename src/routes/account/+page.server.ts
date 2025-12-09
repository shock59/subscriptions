import * as auth from "$lib/server/auth";
import { fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { getRequestEvent } from "$app/server";
import type { Actions, PageServerLoad } from "./$types";
import {
  validatePassword,
  validateUsername,
} from "$lib/server/validateCredentials";
import genPasswordHash from "$lib/server/genPasswordHash";
import assert from "node:assert";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { isUsernameTaken } from "$lib/isUsernameTaken";

export const load: PageServerLoad = async () => {
  const user = requireLogin();
  return { user };
};

export const actions: Actions = {
  changeUsername: async (event) => updateUserDetail("username", event),
  changePassword: async (event) => updateUserDetail("password", event),
  logout,
  deleteAccount,
};

function requireLogin() {
  const { locals } = getRequestEvent();

  if (!locals.user) {
    return redirect(302, "/auth/login");
  }

  return locals.user;
}

async function logout(event: RequestEvent, redirectPath: string = "/") {
  if (!event.locals.session) {
    return fail(401);
  }
  await auth.invalidateSession(event.locals.session.id);
  auth.deleteSessionTokenCookie(event);

  return redirect(302, redirectPath);
}

async function updateUserDetail(
  toUpdate: "username" | "password",
  event: RequestEvent,
) {
  const user = requireLogin();

  if (!user) {
    return fail(401);
  }

  const formData = (await event.request.formData()).get(toUpdate);
  if (!formData) {
    return fail(400, {
      message: `Please specify a new ${toUpdate}`,
    });
  }

  switch (toUpdate) {
    case "username":
      if (!validateUsername(formData)) {
        return fail(400, {
          message:
            "Invalid username (must be between 3 and 31 characters, and only include lowercase letters, numbers, underscores and hyphens)",
        });
      }
      if (await isUsernameTaken(formData)) {
        return fail(400, {
          message: "Username is already taken",
        });
      }

    case "password":
      if (!validatePassword(formData)) {
        return fail(400, {
          message: "Invalid password (must be between 6 and 255 characters)",
        });
      }
      break;
  }

  const passwordHash =
    toUpdate == "password" ? await genPasswordHash(formData) : undefined;

  await updateUser(
    user,
    toUpdate == "username"
      ? {
          username: formData,
        }
      : {
          passwordHash,
        },
  );

  await logout(event, "/auth/login");
}

async function deleteAccount(event: RequestEvent) {
  const user = requireLogin();

  if (!user || !event?.locals?.session?.id) {
    return fail(401);
  }

  await auth.invalidateSession(event.locals.session.id);
  auth.deleteSessionTokenCookie(event);
  await db
    .delete(table.subscription)
    .where(eq(table.subscription.userId, user.id));
  await db.delete(table.user).where(eq(table.user.id, user.id));

  return redirect(302, "/");
}

function updateUser(
  user: {
    id: string;
    username: string;
  },
  toSet: {
    username?: string;
    email?: string;
    passwordHash?: string;
  },
) {
  assert(user);
  return db.update(table.user).set(toSet).where(eq(table.user.id, user.id));
}
