import { z } from "zod";
import { Hono } from "hono";

import { db } from "@/db/drizzel";
import { accounts, insertAccountSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
//import { HTTPException } from "hono/http-exception";
import { and, eq, inArray } from "drizzle-orm";

import { zValidator } from "@hono/zod-validator";

import { createId } from "@paralleldrive/cuid2";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
      //throw new Error("Failed to fetch accounts");
      //to avoid error in the frontend we can return empty array
      //we can use HttpException to handle the error

      // throw new HTTPException(401, {
      //   res: c.json({ error: "Unauthorized" }, 401),
      // });
    }

    //to return the accounts of the only user logged in

    const data = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));

    return c.json({ data });
  })
  //to update the account
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      //get the auth
      const auth = getAuth(c);

      // destructuring the params
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Account ID is required" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .select({
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)));

      if (!data) {
        return c.json({ error: "Account not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertAccountSchema.pick({
        //this is where is going to pick specific fields from the schema
        name: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);

      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .insert(accounts)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
        .returning();

      return c.json({ data }, 201);
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      //getting the auth user
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            inArray(accounts.id, values.ids)
          )
        )
        .returning({
          id: accounts.id,
        });

      return c.json({ data }, 200);
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator(
      "json",
      insertAccountSchema.pick({
        //this is where is going to pick specific fields from the schema
        name: true,
      })
    ),
    async (c) => {
      //get the auth
      const auth = getAuth(c);

      // destructuring the params
      const { id } = c.req.valid("param");

      //get the values from the request body
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Account ID is required" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      //data to update
      const [data] = await db
        .update(accounts)
        .set(values)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
        .returning();

      if (!data) {
        return c.json({ error: "Account not found" }, 404);
      }

      return c.json({ data }, 200);
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      //get the auth
      const auth = getAuth(c);

      // destructuring the params
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Account ID is required" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      //data to update
      const [data] = await db
        .delete(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
        .returning({
          id: accounts.id,
        });

      if (!data) {
        return c.json({ error: "Account not found" }, 404);
      }

      return c.json({ data }, 200);
    }
  );

export default app;

//don't have any data in db from neon because we have not connected the db with clerk auth yet
