import { PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";
import { createNonce } from "@/lib/auth/nonce-store";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { walletAddress?: string };
    const walletAddress = payload.walletAddress?.trim();

    if (!walletAddress) {
      return NextResponse.json({ error: "walletAddress is required." }, { status: 400 });
    }

    new PublicKey(walletAddress);

    const url = new URL(request.url);
    const host = request.headers.get("host") ?? url.host;
    const origin = url.origin;

    return NextResponse.json(createNonce(walletAddress, origin, host));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create nonce." },
      { status: 400 },
    );
  }
}
