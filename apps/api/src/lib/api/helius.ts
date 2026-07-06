import type { AnalysisCoverage } from "../types/token-analysis.js";

type JsonRpcEnvelope<T> = {
  result?: T;
  error?: {
    message?: string;
  };
};

type TokenSupplyResponse = {
  value?: {
    amount?: string;
    decimals?: number;
    uiAmount?: number;
  };
};

type LargestAccountResponse = {
  value?: Array<{
    address?: string;
    amount?: string;
    decimals?: number;
    uiAmount?: number;
    uiAmountString?: string;
  }>;
};

type MultipleAccountsResponse = {
  value?: Array<{
    data?: {
      parsed?: {
        info?: {
          owner?: string;
          tokenAmount?: {
            uiAmount?: number;
          };
        };
      };
    };
  } | null>;
};

type ParsedMintAccountResponse = {
  value?: {
    data?: {
      parsed?: {
        info?: {
          mintAuthority?: string | null;
          freezeAuthority?: string | null;
          supply?: string;
          decimals?: number;
        };
      };
    };
  } | null;
};

type WalletBalancesResponse = {
  totalUsdValue?: number;
};

type WalletTransfersResponse = {
  data?: Array<{
    direction?: "in" | "out";
    timestamp?: number;
  }>;
};

export type HeliusHolderProfile = {
  owner: string;
  tokenAccount: string;
  uiAmount: number;
  percentOfSupply: number;
  totalUsdValue: number | null;
  recentTransfers: number;
  transferDirection: "accumulating" | "distributing" | "mixed" | "unknown";
};

export type HeliusBehaviorSnapshot = {
  available: boolean;
  notes: string[];
  coverage: AnalysisCoverage;
  totalSupply: number | null;
  decimals: number | null;
  mintAuthority: string | null;
  freezeAuthority: string | null;
  topHolderPercent: number | null;
  top5HolderPercent: number | null;
  holderConcentrationLabel: string;
  holderGrowth: string;
  deployerActivity: string;
  walletActivitySummary: string;
  behaviorBias: "accumulating" | "distributing" | "mixed" | "unknown";
  ownerProfiles: HeliusHolderProfile[];
};

const DEFAULT_SNAPSHOT: HeliusBehaviorSnapshot = {
  available: false,
  notes: [],
  coverage: "missing",
  totalSupply: null,
  decimals: null,
  mintAuthority: null,
  freezeAuthority: null,
  topHolderPercent: null,
  top5HolderPercent: null,
  holderConcentrationLabel: "Unknown",
  holderGrowth: "Holder growth requires dedicated holder-history data.",
  deployerActivity: "Deployer activity unavailable.",
  walletActivitySummary: "Large-holder wallet activity unavailable.",
  behaviorBias: "unknown",
  ownerProfiles: [],
};

function getHeliusRpcUrl() {
  return `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;
}

async function heliusRpc<T>(method: string, params: unknown[]) {
  const response = await fetch(getHeliusRpcUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: method,
      method,
      params,
    }),
  });

  if (!response.ok) {
    throw new Error(`Helius RPC request failed: ${response.status}`);
  }

  const payload = (await response.json()) as JsonRpcEnvelope<T>;

  if (payload.error) {
    throw new Error(payload.error.message ?? `Helius RPC ${method} failed.`);
  }

  if (!payload.result) {
    throw new Error(`Helius RPC ${method} returned no result.`);
  }

  return payload.result;
}

async function fetchWalletBalances(owner: string) {
  const response = await fetch(
    `https://api.helius.xyz/v1/wallet/${owner}/balances?api-key=${process.env.HELIUS_API_KEY}&limit=25&showNative=true&showNfts=false`,
  );

  if (!response.ok) {
    throw new Error(`Wallet balances request failed: ${response.status}`);
  }

  return (await response.json()) as WalletBalancesResponse;
}

async function fetchWalletTransfers(owner: string) {
  const response = await fetch(
    `https://api.helius.xyz/v1/wallet/${owner}/transfers?api-key=${process.env.HELIUS_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error(`Wallet transfers request failed: ${response.status}`);
  }

  return (await response.json()) as WalletTransfersResponse;
}

function toPercent(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Number(((value / total) * 100).toFixed(2));
}

function summarizeDirection(inCount: number, outCount: number): HeliusHolderProfile["transferDirection"] {
  if (inCount === 0 && outCount === 0) {
    return "unknown";
  }

  if (inCount > outCount * 1.25) {
    return "accumulating";
  }

  if (outCount > inCount * 1.25) {
    return "distributing";
  }

  return "mixed";
}

function describeConcentration(topHolderPercent: number | null, top5HolderPercent: number | null) {
  if (topHolderPercent === null || top5HolderPercent === null) {
    return "Unknown";
  }

  if (topHolderPercent >= 20 || top5HolderPercent >= 60) {
    return "High concentration";
  }

  if (topHolderPercent >= 10 || top5HolderPercent >= 40) {
    return "Moderate concentration";
  }

  return "Distributed enough for a watchlist token";
}

function describeDeployerActivity(
  mintAuthority: string | null,
  freezeAuthority: string | null,
  deployerTransfers: WalletTransfersResponse | null,
) {
  if (!mintAuthority && !freezeAuthority) {
    return "Mint and freeze authority appear unset or unavailable.";
  }

  if (!deployerTransfers?.data?.length) {
    return mintAuthority
      ? "Mint authority is visible, but recent authority wallet transfers are limited."
      : "Freeze authority is visible, but recent authority wallet transfers are limited.";
  }

  const recent = deployerTransfers.data.filter((transfer) => {
    if (!transfer.timestamp) {
      return false;
    }

    return transfer.timestamp * 1000 >= Date.now() - 24 * 60 * 60 * 1000;
  }).length;

  return recent > 0
    ? `Authority-linked wallet shows ${recent} recent transfers in the last 24 hours.`
    : "Authority-linked wallet is visible, but no recent 24h transfer burst was detected.";
}

export async function fetchHeliusBehaviorSnapshot(tokenAddress: string): Promise<HeliusBehaviorSnapshot> {
  if (!process.env.HELIUS_API_KEY) {
    return {
      ...DEFAULT_SNAPSHOT,
      notes: ["HELIUS_API_KEY is not configured."],
    };
  }

  try {
    const [mintInfo, supplyInfo, largestAccounts] = await Promise.all([
      heliusRpc<ParsedMintAccountResponse>("getAccountInfo", [tokenAddress, { encoding: "jsonParsed" }]),
      heliusRpc<TokenSupplyResponse>("getTokenSupply", [tokenAddress]),
      heliusRpc<LargestAccountResponse>("getTokenLargestAccounts", [tokenAddress]),
    ]);

    const mintParsed = mintInfo.value?.data?.parsed?.info;
    const totalSupply = supplyInfo.value?.uiAmount ?? null;
    const decimals = supplyInfo.value?.decimals ?? mintParsed?.decimals ?? null;
    const largest = (largestAccounts.value ?? []).filter((account) => typeof account.address === "string");

    if (!largest.length || !totalSupply) {
      return {
        ...DEFAULT_SNAPSHOT,
        notes: ["Helius returned limited holder data for this mint."],
        coverage: "partial",
      };
    }

    const tokenAccounts = largest.slice(0, 5).map((account) => account.address as string);
    const tokenOwnersResponse = await heliusRpc<MultipleAccountsResponse>("getMultipleAccounts", [tokenAccounts, { encoding: "jsonParsed" }]);

    const ownerEntries = tokenAccounts.map((tokenAccount, index) => {
      const largestAccount = largest[index];
      const ownerInfo = tokenOwnersResponse.value?.[index]?.data?.parsed?.info;
      const uiAmount = largestAccount.uiAmount ?? ownerInfo?.tokenAmount?.uiAmount ?? 0;

      return {
        tokenAccount,
        owner: ownerInfo?.owner ?? null,
        uiAmount,
        percentOfSupply: toPercent(uiAmount, totalSupply),
      };
    }).filter((entry) => entry.owner);

    const uniqueOwners = [...new Set(ownerEntries.map((entry) => entry.owner as string))].slice(0, 3);

    const ownerData = await Promise.all(uniqueOwners.map(async (owner) => {
      try {
        const [balances, transfers] = await Promise.all([fetchWalletBalances(owner), fetchWalletTransfers(owner)]);
        return { owner, balances, transfers };
      } catch {
        return { owner, balances: null, transfers: null };
      }
    }));

    let deployerTransfers: WalletTransfersResponse | null = null;
    if (mintParsed?.mintAuthority) {
      try {
        deployerTransfers = await fetchWalletTransfers(mintParsed.mintAuthority);
      } catch {
        deployerTransfers = null;
      }
    }

    const ownerProfiles: HeliusHolderProfile[] = ownerEntries.slice(0, 3).map((entry) => {
      const owner = ownerData.find((item) => item.owner === entry.owner);
      const recentTransfers = (owner?.transfers?.data ?? []).filter((transfer) => {
        if (!transfer.timestamp) {
          return true;
        }

        return transfer.timestamp * 1000 >= Date.now() - 24 * 60 * 60 * 1000;
      });
      const inCount = recentTransfers.filter((transfer) => transfer.direction === "in").length;
      const outCount = recentTransfers.filter((transfer) => transfer.direction === "out").length;

      return {
        owner: entry.owner as string,
        tokenAccount: entry.tokenAccount,
        uiAmount: Number(entry.uiAmount.toFixed(4)),
        percentOfSupply: entry.percentOfSupply,
        totalUsdValue: owner?.balances?.totalUsdValue ?? null,
        recentTransfers: recentTransfers.length,
        transferDirection: summarizeDirection(inCount, outCount),
      };
    });

    const topHolderPercent = ownerEntries[0]?.percentOfSupply ?? null;
    const top5HolderPercent = Number(ownerEntries.reduce((sum, entry) => sum + entry.percentOfSupply, 0).toFixed(2));
    const directionCounts = ownerProfiles.reduce(
      (acc, profile) => {
        acc[profile.transferDirection] += 1;
        return acc;
      },
      { accumulating: 0, distributing: 0, mixed: 0, unknown: 0 },
    );

    const behaviorBias =
      directionCounts.accumulating > directionCounts.distributing && directionCounts.accumulating > 0
        ? "accumulating"
        : directionCounts.distributing > directionCounts.accumulating && directionCounts.distributing > 0
          ? "distributing"
          : ownerProfiles.length > 0
            ? "mixed"
            : "unknown";

    const activeProfiles = ownerProfiles.filter((profile) => profile.recentTransfers > 0).length;
    const walletCoverage: AnalysisCoverage = ownerProfiles.length >= 3 ? "complete" : ownerProfiles.length > 0 ? "partial" : "missing";

    return {
      available: true,
      notes: walletCoverage === "complete" ? [] : ["Helius wallet enrichment is partial for this token."],
      coverage: walletCoverage,
      totalSupply,
      decimals,
      mintAuthority: mintParsed?.mintAuthority ?? null,
      freezeAuthority: mintParsed?.freezeAuthority ?? null,
      topHolderPercent,
      top5HolderPercent,
      holderConcentrationLabel: describeConcentration(topHolderPercent, top5HolderPercent),
      holderGrowth:
        activeProfiles >= 2
          ? "Large-holder wallets show recent movement, but holder-history growth is still approximate."
          : "Holder growth remains approximate because holder-history endpoints are not yet tracked over time.",
      deployerActivity: describeDeployerActivity(
        mintParsed?.mintAuthority ?? null,
        mintParsed?.freezeAuthority ?? null,
        deployerTransfers,
      ),
      walletActivitySummary:
        ownerProfiles.length > 0
          ? `${activeProfiles} of ${ownerProfiles.length} tracked large-holder wallets show recent transfers.`
          : "Large-holder wallet activity could not be derived.",
      behaviorBias,
      ownerProfiles,
    };
  } catch (error) {
    return {
      ...DEFAULT_SNAPSHOT,
      notes: [error instanceof Error ? error.message : "Helius enrichment failed."],
      coverage: "missing",
    };
  }
}
