// import { drizzle } from "drizzle-orm/neon-http";
// import { neon } from "@neondatabase/serverless";
// import { config } from "dotenv";

// config({ path: ".env" }); // or .env.local

// export const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle(sql);

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Get the DATABASE_URL from environment without using dotenv
const DATABASE_URL = process.env.DATABASE_URL!;

export const sql = neon(DATABASE_URL);
export const db = drizzle(sql);
