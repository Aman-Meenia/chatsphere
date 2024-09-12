import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SECRET,
  });
  const url = request.nextUrl;
  // console.log("---------------TOKEN MIDDLEWARE -----------------");
  // console.log(url);
  // console.log(url.pathname, token, "154522262555");

  if (
    token &&
    (url.pathname == "/login" ||
      url.pathname === "/signup" ||
      url.pathname.startsWith("/verify/"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!token && url.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/signup", "/", "/verify/:username*"],
};
