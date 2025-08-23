import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { getDashboardPathByRole } from "./app/utils/roleRedirect";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const user = await getToken({ req: request });
  const token = user?.accessToken;
  const expiresAt = new Date(user?.exp * 1000);
  const role = user?.roles[0];

  if (expiresAt && new Date(expiresAt) < new Date()) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && role) {
    const expectedPath = getDashboardPathByRole(role);
    const expectedPrefix = new URL(expectedPath, request.url).pathname.split(
      "/"
    )[1];
    if (!pathname.startsWith(`/${expectedPrefix}`)) {
      return NextResponse.redirect(new URL(expectedPath, request.url));
    }
  } else {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// const roleMatcher = Object.values(roleDashboardPaths).map((path) => {
//   const prefix = path.split("/")[1];
//   return `/${prefix}/:path*`;
// });

export const config = {
  matcher: ["/", "/redirect", "/admin/:path*", "/student/:path*"],
};
