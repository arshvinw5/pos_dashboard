import { Hono } from "hono";
import { handle } from "hono/vercel";

import authors from "./authors";
import books from "./book";

//import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.route("/authors", authors);
app.route("/book", books);

// app.get("/hello", clerkMiddleware(), (c) => {
//   const auth = getAuth(c);

//   if (!auth?.userId) {
//     return c.json({ message: "Unauthorized" }, 401);
//   }

//   return c.json({
//     message: `Hello ${auth.userId}!`,
//   });
// });

export const GET = handle(app);
export const POST = handle(app);

// app
//   .get("/hello", (c) => {
//     return c.json({
//       message: "Hello Next.js!",
//     });
//   })
//   .get(
//     "/hello/:test",
//     zValidator(
//       "param",
//       z.object({
//         test: z.string(),
//       })
//     ),
//     (c) => {
//       //const { test } = c.req.param();

//       //this is the safest way to get the param
//       //const test123 = c.req.param("test");
//       const { test } = c.req.valid("param");

//       return c.json({
//         message: `Hello ${test}!`,
//         text: test,
//       });
//     }
//   )
//   .post(
//     "/createUser/:test",
//     zValidator(
//       "json",
//       z.object({
//         name: z.string(),
//         email: z.string().email(),
//         age: z.number().int().min(0).max(120),
//       })
//     ),
//     zValidator(
//       "param",
//       z.object({
//         test: z.string(),
//       })
//     ),
//     (c) => {
//       //   const { name, email, age } = c.req.valid("json");
//       //   const { test } = c.req.valid("param");

//       return c.json({});
//     }
//   );
