import { z } from "zod";

export const analyzeSchema = z.object({
  tokenAddress: z.string().min(1, "tokenAddress is required"),
  mode: z.enum(["auto", "mock"]).optional(),
});

export type AnalyzeInput = z.infer<typeof analyzeSchema>;
