import {
  type MiddlewareConfig,
  type NextRequest,
  NextResponse,
} from "next/server";
import { getAccessToken } from "./lib/auth";
import AuthenticationError from "./lib/auth/types/AuthenticationError";

export async function proxy(request: NextRequest) {
  let accessToken: string | undefined = undefined;
  try {
    accessToken = (await getAccessToken()).accessToken;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      switch (error.code) {
        case "NFND":
        case "UNKN":
          if (request.nextUrl.pathname !== "/auth/login") {
            return NextResponse.redirect(`${process.env.HOST_URI}/auth/login`);
          }
      }
    }
  }

  const response = NextResponse.next();

  if (accessToken) {
    response.cookies.set("_access_t", accessToken, {
      httpOnly: true,
      domain: `.${process.env.HOST_DOMAIN}`,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!auth/login|auth/sign-up|auth/forgot-password|auth/verify-email/verify|api|_next|.*\\..*).*)", // Everything except /api and static files
  ],
} satisfies MiddlewareConfig;
