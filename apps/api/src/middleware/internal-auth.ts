import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const internalAuth = createMiddleware(async (c, next) => {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) {
    await next();
    return;
  }
  const auth = c.req.header("Authorization");
  if (!auth || auth !== `Bearer ${secret}`) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  await next();
});
