import bs58 from "bs58";
import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";
import { consumeNonce, buildSignInMessage } from "@/lib/auth/nonce-store";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      walletAddress?: string;
      signature?: string;
    };

    const walletAddress = payload.walletAddress?.trim();
    const signature = payload.signature?.trim();

    if (!walletAddress || !signature) {
      return NextResponse.json({ error: "walletAddress and signature are required." }, { status: 400 });
    }

    const nonceRecord = consumeNonce(walletAddress);

    if (!nonceRecord) {
      return NextResponse.json({ error: "Nonce is invalid or expired." }, { status: 400 });
    }

    const message = buildSignInMessage(nonceRecord);
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = new PublicKey(walletAddress).toBytes();
    const verified = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

    if (!verified) {
      return NextResponse.json({ error: "Wallet signature verification failed." }, { status: 401 });
    }

    const { token, session } = await createSessionToken(walletAddress);
    await setSessionCookie(token);

    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Wallet verification failed." },
      { status: 400 },
    );
  }
}
