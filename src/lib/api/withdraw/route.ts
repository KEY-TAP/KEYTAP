// 회원탈퇴 서버 API 라우트
// 탈퇴 후 메인으로 이동

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

type WithdrawRequestBody = {
  password?: unknown;
};

const getAccessToken = (request: NextRequest) => {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.replace("Bearer ", "");
};

const isConstraintError = (message: string) => {
  const lowerMessage = message.toLowerCase();

  return lowerMessage.includes("foreign key") || lowerMessage.includes("constraint");
};

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { message: "Supabase 환경변수가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    const accessToken = getAccessToken(request);

    if (!accessToken) {
      return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as WithdrawRequestBody;
    const password = typeof body.password === "string" ? body.password : "";

    if (password.trim().length === 0) {
      return NextResponse.json({ message: "비밀번호를 입력해주세요." }, { status: 400 });
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json({ message: "로그인 정보를 확인할 수 없습니다." }, { status: 401 });
    }

    if (!user.email) {
      return NextResponse.json(
        { message: "이메일 계정만 비밀번호 재확인이 가능합니다." },
        { status: 400 },
      );
    }

    const { error: passwordError } = await supabaseAuth.auth.signInWithPassword({
      email: user.email,
      password,
    });

    if (passwordError) {
      return NextResponse.json({ message: "비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    const deleteProfile = async () => {
      const { error } = await supabaseAdmin.from("profiles").delete().eq("id", user.id);

      return error;
    };

    const deleteAuthUser = async () => {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

      return error;
    };

    let deleteUserError = await deleteAuthUser();

    /**
     profiles 테이블이 auth.users를 참조하고 있는데
     on delete cascade가 없으면 Auth 유저 삭제가 FK constraint 때문에 실패할 수 있음.
     그 경우 profiles를 먼저 삭제하고 Auth 유저 삭제를 한 번 더 시도.
     */
    if (deleteUserError && isConstraintError(deleteUserError.message)) {
      const profileDeleteError = await deleteProfile();

      if (profileDeleteError) {
        console.error("profile delete error:", profileDeleteError);

        return NextResponse.json(
          { message: "회원 정보 삭제 중 오류가 발생했습니다." },
          { status: 500 },
        );
      }

      deleteUserError = await deleteAuthUser();
    }

    if (deleteUserError) {
      console.error("auth user delete error:", deleteUserError);

      return NextResponse.json(
        { message: "회원탈퇴 처리 중 오류가 발생했습니다." },
        { status: 500 },
      );
    }

    /**
     * on delete cascade로 profiles가 이미 삭제된 경우에는 영향 없음.
     * cascade가 없는 구조인데 Auth 유저 삭제가 성공한 경우를 대비한 정리용.
     */
    const profileCleanupError = await deleteProfile();

    if (profileCleanupError) {
      console.error("profile cleanup error:", profileCleanupError);
    }

    return NextResponse.json({
      message: "회원탈퇴가 완료되었습니다.",
    });
  } catch (error) {
    console.error("withdraw route error:", error);

    return NextResponse.json({ message: "회원탈퇴 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
