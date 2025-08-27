// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log("middleware called on:", req.nextUrl.pathname);
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    // pages: {
    //   signIn: "/SignIn",
    // },
  }
);

export const config = {
  matcher: ["/((?!SignUp|SignIn).*)"],
};
