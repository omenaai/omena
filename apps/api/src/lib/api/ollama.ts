import { Ollama } from "ollama";

import type {
  BehaviorAnalysis,
  RiskAnalysis,
  SignalAnalysis,
  TokenOverview,
} from "../types/token-analysis.js";

const DEFAULT_OLLAMA_BASE_URL = "http://127.0.0.1:11434";
const DEFAULT_OLLAMA_MODEL = "qwen2.5:3b";
const DEFAULT_OLLAMA_TIMEOUT_MS = 15000;

function getOllamaConfig() {
  return {
    baseUrl: process.env.OLLAMA_BASE_URL?.trim() || DEFAULT_OLLAMA_BASE_URL,
    apiKey: process.env.OLLAMA_API_KEY?.trim() || "",
    model: process.env.OLLAMA_MODEL?.trim() || DEFAULT_OLLAMA_MODEL,
    timeoutMs: Number(process.env.OLLAMA_TIMEOUT_MS ?? DEFAULT_OLLAMA_TIMEOUT_MS),
  };
}

function buildPrompt(input: {
  token: TokenOverview;
  risk: RiskAnalysis;
  behavior: BehaviorAnalysis;
  signals: SignalAnalysis;
  dataQualityNotes: string[];
}) {
  return JSON.stringify(
    {
      token: input.token,
      risk: input.risk,
      behavior: input.behavior,
      signals: input.signals,
      dataQualityNotes: input.dataQualityNotes,
    },
    null,
    2,
  );
}

function getSystemPrompt() {
  return "You are OMENA Context Intelligence. Produce cautious token analysis only. Never give buy, sell, moon, 100x, profit, or financial-advice language. Keep the tone minimal, credible, and plain English.";
}

function parseSummaryResponse(raw: string): string {
  const summary = raw.trim();

  if (!summary) {
    throw new Error("Ollama returned an invalid AI summary: response was empty.");
  }

  const summaryWithoutCodeFence = summary.replace(/^```(?:text|markdown|json)?\s*/i, "").replace(/\s*```$/, "").trim();

  if (!summaryWithoutCodeFence) {
    throw new Error("Ollama returned an invalid AI summary: response was empty.");
  }

  return summaryWithoutCodeFence;
}

export async function generateOllamaContextSummary(input: {
  token: TokenOverview;
  risk: RiskAnalysis;
  behavior: BehaviorAnalysis;
  signals: SignalAnalysis;
  dataQualityNotes: string[];
}) {
  const { baseUrl, apiKey, model, timeoutMs } = getOllamaConfig();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const ollama = new Ollama({
    host: baseUrl,
    fetch: (url, init) => fetch(url as string, { ...(init as RequestInit), signal: controller.signal }),
    headers: apiKey
      ? {
          Authorization: `Bearer ${apiKey}`,
        }
      : undefined,
  });

  try {
    const response = await ollama.chat({
      model,
      stream: false,
      messages: [
        {
          role: "system",
          content: getSystemPrompt(),
        },
        {
          role: "user",
          content:
            "Write only a short OMENA aiSummary in plain English for the following token analysis payload. Keep it to 2 or 3 sentences, mention partial data when needed, and do not use markdown or JSON.\n\n" +
            buildPrompt(input),
        },
      ],
      options: {
        temperature: 0.2,
      },
      keep_alive: "5m",
    });

    const content = response.message?.content?.trim();

    if (!content) {
      throw new Error("Ollama returned an empty response.");
    }

    return parseSummaryResponse(content);
  } finally {
    clearTimeout(timeoutId);
  }
}
