// src/utils/supabase/middleware.ts

import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            for (const { name, value } of cookiesToSet) {
              request.cookies.set(name, value);
            }
            response = NextResponse.next({ request });
            for (const { name, value, options } of cookiesToSet) {
              response.cookies.set(name, value, options);
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.getUser();

    const protectedPaths = [
      "/admin",
      "/post/create",
      "/post/edit",
      "/associate/edit",
      "/associate/create",
    ];

    const pathname = request.nextUrl.pathname;

    const isProtected =
      protectedPaths.some((path) => pathname.startsWith(path)) ||
      pathname.startsWith("/protected");

    if (error && isProtected) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return response;
  } catch {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
