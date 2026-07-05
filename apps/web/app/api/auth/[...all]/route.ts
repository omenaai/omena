import { toNextJsHandler } from "better-auth/next-js";
import { emailAuth, ensureBetterAuthSchema } from "@/lib/auth/better-auth";

const handler = toNextJsHandler(emailAuth);

function withSchema(handlerFn: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    await ensureBetterAuthSchema();
    return handlerFn(request);
  };
}

export const GET = withSchema(handler.GET);
export const POST = withSchema(handler.POST);
export const PUT = withSchema(handler.PUT);
export const PATCH = withSchema(handler.PATCH);
export const DELETE = withSchema(handler.DELETE);
