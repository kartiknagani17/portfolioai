import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const domain = process.env.NEXT_PUBLIC_PORTFOLIO_DOMAIN || "portfolioai.app";
  const subdomain = host.replace(`.${domain}`, "").replace(domain, "");

  if (subdomain && subdomain !== host && subdomain !== "www") {
    return NextResponse.rewrite(
      new URL(`/p/${subdomain}${request.nextUrl.pathname}`, request.url)
    );
  }

  return NextResponse.next();
}
