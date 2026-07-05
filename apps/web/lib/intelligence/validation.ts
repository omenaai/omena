const base58Pattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export function validateSolanaTokenAddress(value: string) {
  const tokenAddress = value.trim();

  if (!tokenAddress) {
    return { ok: false as const, message: "Token address is required." };
  }

  if (!base58Pattern.test(tokenAddress)) {
    return { ok: false as const, message: "Enter a valid Solana token address." };
  }

  return { ok: true as const, value: tokenAddress };
}
