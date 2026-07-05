import path from "node:path";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactStrictMode: true,
  output: "standalone",
  // Required for standalone output to correctly trace files in a pnpm monorepo
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
