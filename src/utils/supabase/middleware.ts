import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/utils/is-admin";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
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
            response = NextResponse.next({
              request,
            });
            for (const { name, value, options } of cookiesToSet) {
              response.cookies.set(name, value, options);
            }
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    // protected routes
    // if (request.nextUrl.pathname.startsWith("/protected") && user.error) {
    //   return NextResponse.redirect(new URL("/sign-in", request.url));
    // }

    if (request.nextUrl.pathname === "/admin" && user.error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (request.nextUrl.pathname === "/post/create" && user.error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (request.nextUrl.pathname === "/post/edit/" && user.error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Protect "/associate/edit/" route against non-admins
    if (request.nextUrl.pathname.startsWith("/associate/edit")) {
      // Redirect unauthenticated users
      if (user.error) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      // Redirect non-admin users
      const isUserAdmin = await isAdmin();
      if (!isUserAdmin) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }

    // Protect "/associate/create/" route against non-admins
    if (request.nextUrl.pathname.startsWith("/associate/create")) {
      // Redirect unauthenticated users
      if (user.error) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      // Redirect non-admin users
      const isUserAdmin = await isAdmin();
      if (!isUserAdmin) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }

    if (request.nextUrl.pathname.startsWith("/protected") && user.error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // if (request.nextUrl.pathname === "/" && !user.error) {
    //   return NextResponse.redirect(new URL("/protected", request.url));
    // }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
