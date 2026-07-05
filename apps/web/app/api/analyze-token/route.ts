import { NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth/session";
import { analyzeTokenAddress } from "@/lib/intelligence/analyze-token";

export async function POST(request: Request) {
  const session = await getRequestSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as {
      tokenAddress?: string;
      mode?: "auto" | "mock";
    };

    if (!payload.tokenAddress) {
      return NextResponse.json({ error: "tokenAddress is required." }, { status: 400 });
    }

    const result = await analyzeTokenAddress(payload.tokenAddress, {
      forceMock: payload.mode === "mock",
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown analysis error." },
      { status: 400 },
    );
  }
}
