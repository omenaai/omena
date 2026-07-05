import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_AUDIENCE, AUTH_COOKIE_NAME, AUTH_ISSUER, getAuthSecret } from "@/lib/auth/config";
import { emailAuth, ensureBetterAuthSchema } from "@/lib/auth/better-auth";

const SUBDOMAIN_ROUTES: Record<string, string> = {
  docs: "/docs",
  litepaper: "/litepaper",
};

async function hasValidWalletSession(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  try {
    await jwtVerify(token, getAuthSecret(), {
      issuer: AUTH_ISSUER,
      audience: AUTH_AUDIENCE,
    });
    return true;
  } catch {
    return false;
  }
}

async function hasValidEmailSession(request: NextRequest) {
  try {
    await ensureBetterAuthSchema();
    const session = await emailAuth.api.getSession({
      headers: request.headers,
    });

    return Boolean(session);
  } catch {
    return false;
  }
}

async function hasValidSession(request: NextRequest) {
  if (await hasValidWalletSession(request)) {
    return true;
  }

  return hasValidEmailSession(request);
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/app") || pathname === "/api/analyze-token") {
    const authenticated = await hasValidSession(request);

    if (!authenticated) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      url.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(url);
    }
  }

  const hostname = request.headers.get("host")?.split(":")[0].toLowerCase() ?? "";
  const subdomain = hostname.split(".")[0];
  const targetPath = SUBDOMAIN_ROUTES[subdomain];

  if (!targetPath || pathname !== "/") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = targetPath;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/", "/app/:path*", "/api/analyze-token"],
};
