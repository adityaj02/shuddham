import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  // Determine where to redirect after login
  // Prevent redirecting to localhost if the app is running in production (e.g., if env var is misconfigured)
  let appUrl = origin;
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
    appUrl = process.env.NEXT_PUBLIC_APP_URL;
  } else if (process.env.VERCEL_URL) {
    appUrl = `https://${process.env.VERCEL_URL}`;
  }

  if (code) {
    // Create a mutable response so we can write the session cookie onto it
    const redirectResponse = NextResponse.redirect(`${appUrl}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // Write the session cookie onto BOTH the request and the response
            request.cookies.set({ name, value, ...options } as any);
            redirectResponse.cookies.set({ name, value, ...options } as any);
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: "", ...options } as any);
            redirectResponse.cookies.set({ name, value: "", ...options } as any);
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Session cookie is now written onto redirectResponse — user will be logged in
      return redirectResponse;
    }

    console.error("[Auth Callback] exchangeCodeForSession error:", error.message);
  }

  // Auth failed — send to error page
  return NextResponse.redirect(`${appUrl}/auth/auth-code-error`);
}
