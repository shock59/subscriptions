import { verify } from "@node-rs/argon2";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import * as auth from "$lib/server/auth";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import type { Actions, PageServerLoad } from "./$types";
import generateId from "$lib/server/generateId";
import {
  validatePassword,
  validateUsername,
} from "$lib/server/validateCredentials";
import genPasswordHash from "$lib/server/genPasswordHash";
import { isUsernameTaken } from "$lib/isUsernameTaken";
import sendEmail from "$lib/server/sendEmail";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, "/");
  }
  return {};
};

export const actions: Actions = {
  login: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (!validateUsername(username)) {
      return fail(400, {
        message: "Invalid email",
      });
    }
    if (!validatePassword(password)) {
      return fail(400, {
        message: "Invalid password",
      });
    }

    const results = await db
      .select()
      .from(table.user)
      .where(eq(table.user.username, username));

    const existingUser = results.at(0);
    if (!existingUser) {
      return fail(400, { message: "Incorrect email or password" });
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) {
      return fail(400, { message: "Incorrect username or password" });
    }

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, existingUser.id);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return redirect(302, "/");
  },
  register: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (!validateUsername(username)) {
      return fail(400, {
        message:
          "Invalid email (must be between 3 and 255 characters and be a valid email address)",
      });
    }
    if (await isUsernameTaken(username)) {
      return fail(400, {
        message: "Email is already taken",
      });
    }
    if (!validatePassword(password)) {
      return fail(400, {
        message: "Invalid password (must be between 6 and 255 characters)",
      });
    }

    const userId = generateId();
    const passwordHash = await genPasswordHash(password);

    try {
      await db.insert(table.user).values({
        id: userId,
        creationDate: new Date(),
        username,
        passwordHash,
      });

      const baseEmailContent = `Hi ${username.split("@")[0]},
      
Thank you for signing up and welcome to Subscriptions! You can now follow all of your favourite YouTube channels without a subscription. We hope you enjoy using the service.`;
      sendEmail(
        username,
        "Welcome to Subscriptions",
        baseEmailContent,
        baseEmailContent
          .replace("\n\n", "<br>")
          .replace(
            "Subscriptions",
            `<a href="${env.WEBSITE_URL}">Subscriptions</a>`,
          ),
      );

      const sessionToken = auth.generateSessionToken();
      const session = await auth.createSession(sessionToken, userId);
      auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    } catch {
      return fail(500, { message: "An error has occurred" });
    }
    return redirect(302, "/");
  },
};
