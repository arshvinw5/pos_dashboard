import { createInsertSchema } from "drizzle-zod";
import { pgTable, text } from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  plaidId: text("plaid_id"),
  userId: text("user_id").notNull(),
});

export const insertAccountSchema = createInsertSchema(accounts);
