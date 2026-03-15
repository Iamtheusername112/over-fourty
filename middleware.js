import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const dashboardPaths = ["/dashboard", "/dashboard/optimizer", "/dashboard/elder"];

function isDashboardPath(pathname) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

export async function middleware(request) {
  let response = NextResponse.next({ request });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isDashboardPath(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  if (pathname === "/login" && user) {
    const { data: profile } = await supabase.from("profiles").select("role, onboarding_complete").eq("id", user.id).single();
    if (profile?.onboarding_complete) {
      const dashboardPath = profile.role === "ELDER" ? "/dashboard/elder" : "/dashboard/optimizer";
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (pathname === "/onboarding" && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isDashboardPath(pathname)) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const { data: profile } = await supabase.from("profiles").select("role, onboarding_complete").eq("id", user.id).single();
    if (!profile?.onboarding_complete) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    if (pathname === "/dashboard") {
      const redirectPath = profile.role === "ELDER" ? "/dashboard/elder" : "/dashboard/optimizer";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard", "/dashboard/optimizer", "/dashboard/elder", "/onboarding", "/login"],
};
