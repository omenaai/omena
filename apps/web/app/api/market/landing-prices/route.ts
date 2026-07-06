import { NextResponse } from "next/server";

const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://localhost:8787";

export async function GET() {
  try {
    const res = await fetch(`${API_INTERNAL_URL}/market/prices`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Market prices request failed: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json(
      { prices: [], source: "fallback" },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  }
}
