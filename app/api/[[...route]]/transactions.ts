import { z } from "zod";
import { Hono } from "hono";

import { db } from "@/db/drizzel";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
//import { HTTPException } from "hono/http-exception";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";

import { zValidator } from "@hono/zod-validator";

import { createId } from "@paralleldrive/cuid2";

import {
  transactions,
  insertTransactionSchema,
  categories,
  accounts,
} from "@/db/schema";

import { parse, subDays } from "date-fns";

//the reason why are adding zValidator in get to filter things

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);

      const { from, to, accountId } = c.req.valid("query");

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

      //to filter data for 30 days

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;

      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      //inner join accounts and transactions must have this row
      //left join categories because some transactions may not have a category

      //transactions belongs to accounts
      //eq(accounts.userId, auth.userId) it's need to validate with auth id
      //and need to match the userId

      const data = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          category: categories.name,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        )
        .orderBy(desc(transactions.date));

      return c.json({ data });
    }
  )
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
          id: transactions.id,
          date: transactions.date,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)));

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
      insertTransactionSchema.omit({
        id: true, /// creates a modified version of the schema that excludes the id field
      })
    ),
    async (c) => {
      const auth = getAuth(c);

      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .insert(transactions)
        .values({
          id: createId(),
          ...values,
        })
        .returning();

      return c.json({ data }, 201);
    }
  )
  .post(
    "/bulk-create",
    clerkMiddleware(),
    //Client shouldn't provide IDs
    zValidator("json", z.array(insertTransactionSchema.omit({ id: true }))),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .insert(transactions)
        .values(
          values.map((value) => ({
            id: createId(), // You generate the ID server-side
            ...value,
          }))
        )
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

      //create a list of ids to delete

      //this is going to load and filter the transactions only have accountId

      //->innerJoin(accounts, eq(transactions.accountId, accounts.id))

      // inArray(transactions.id, values.ids), ==== ids: z.array(z.string()),

      // only load transaction passed this ids values

      //eq(accounts.userId, auth.userId)

      // also verify the matching userId of the account
      const transactionToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(
              inArray(transactions.id, values.ids),
              eq(accounts.userId, auth.userId)
            )
          )
      );

      const data = await db
        .with(transactionToDelete)
        .delete(transactions)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionToDelete})`)
        )
        .returning({
          id: transactions.id,
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
      insertTransactionSchema.omit({
        id: true, // creates a modified version of the schema that excludes the id field
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

      const transactionToUpdate = db.$with("transactions_to_update").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))
      );

      //data to update
      const [data] = await db
        .with(transactionToUpdate)
        .update(transactions)
        .set(values)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionToUpdate})`)
        )
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

      const transactionToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))
      );

      //data to update
      const [data] = await db
        .with(transactionToDelete)
        .delete(transactions)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionToDelete})`)
        )
        .returning({
          id: transactions.id,
        });

      //because we need to remove the row that belongs table

      if (!data) {
        return c.json({ error: "Account not found" }, 404);
      }

      return c.json({ data }, 200);
    }
  );

export default app;

//don't have any data in db from neon because we have not connected the db with clerk auth yet
