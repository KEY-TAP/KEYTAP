// 인증 관련 미들웨어
// 사용자가 특정 페이지에 접근할 때 인증 상태를 확인하고, 필요에 따라 리디렉션을 수행
// 로그인하지 않은 상태에서 보호된 페이지에 접근하려고 하면 로그인 페이지로 리디렉션
// 로그인한 상태에서 로그인 또는 회원가입 페이지에 접근하려고 하면 메인 페이지로 리디렉션
// /admin 하위 경로는 로그인 + 관리자 권한(admin/super_admin)까지 함께 확인
// Supabase를 사용하여 서버 측에서 인증 상태를 확인하고, 쿠키를 통해 세션 정보를 관리
// Next.js의 미들웨어 기능을 활용하여 요청을 가로채고, 인증 상태에 따라 적절한 응답을 반환

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const protectedRoutes = ["/MyPage", "/WishListPage"];
  const authRoutes = ["/LoginPage", "/SignUpPage"];
  const isAdminRoute = pathname.startsWith("/admin");

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/LoginPage";
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/MainPage";
    return NextResponse.redirect(url);
  }

  if (isAdminRoute) {
    const redirectToLogin = () => {
      const loginUrl = new URL("/LoginPage", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    };

    if (!user) {
      return redirectToLogin();
    }

    const { data: userRow } = await supabase
      .from("users")
      .select("user_role")
      .eq("user_id", user.id)
      .single();

    if (
      userRow?.user_role !== "admin" &&
      userRow?.user_role !== "super_admin"
    ) {
      return redirectToLogin();
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/MyPage/:path*",
    "/WishListPage/:path*",
    "/LoginPage",
    "/SignUpPage",
    "/admin/:path*",
  ],
};
