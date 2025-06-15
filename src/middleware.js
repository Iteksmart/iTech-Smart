import { NextResponse } from "next/server";

export const config = {
  matcher: "/integrations/:path*",
};

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-createxyz-project-id", "98a64ba1-5d71-48bf-8d92-26b9e14c8bce");
  requestHeaders.set("x-createxyz-project-group-id", "e78644ee-4e08-4282-89ba-17e05c2cd4f2");


  request.nextUrl.href = `https://www.create.xyz/${request.nextUrl.pathname}`;

  return NextResponse.rewrite(request.nextUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}