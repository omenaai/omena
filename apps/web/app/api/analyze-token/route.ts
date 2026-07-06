import { NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth/session";

const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://localhost:8787";

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

    const res = await fetch(`${API_INTERNAL_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.INTERNAL_API_SECRET
          ? { Authorization: `Bearer ${process.env.INTERNAL_API_SECRET}` }
          : {}),
      },
      body: JSON.stringify({ tokenAddress: payload.tokenAddress, mode: payload.mode }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: (data as { message?: string }).message ?? "Analysis failed." },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown analysis error." },
      { status: 400 },
    );
  }
}
