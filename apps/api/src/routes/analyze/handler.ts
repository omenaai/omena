import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { analyzeTokenAddress } from "../../lib/intelligence/analyze-token.js";
import type { AnalyzeInput } from "./schema.js";

export async function handleAnalyze(c: Context) {
  const body = await c.req.valid("json" as never) as AnalyzeInput;

  try {
    const result = await analyzeTokenAddress(body.tokenAddress, {
      forceMock: body.mode === "mock",
    });
    return c.json(result);
  } catch (error) {
    throw new HTTPException(400, {
      message: error instanceof Error ? error.message : "Analysis failed.",
    });
  }
}
