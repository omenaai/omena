import path from "node:path";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactStrictMode: true,

  // standalone output only needed for Docker/VPS production builds
  ...(isProd && {
    output: "standalone",
    outputFileTracingRoot: path.join(__dirname, "../../"),
    outputFileTracingExcludes: {
      "*": [
        ".git/**",
        ".next/**",
        "node_modules/.cache/**",
        "**/*.map",
      ],
    },
  }),

  experimental: {
    // pre-bundle heavy icon/component libraries — reduces per-request transforms
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-avatar",
    ],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
