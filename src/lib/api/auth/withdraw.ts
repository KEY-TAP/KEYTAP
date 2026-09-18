// 유저 계정을 탈퇴하는 API

import { supabase } from "@/lib/supabaseClient";

export type WithdrawPayload = {
  password: string;
};

export async function withdraw({ password }: WithdrawPayload) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch("/api/auth/withdraw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      password,
    }),
  });

  const result = (await response.json().catch(() => null)) as {
    message?: string;
  } | null;

  if (!response.ok) {
    throw new Error(result?.message ?? "회원탈퇴 중 오류가 발생했습니다.");
  }

  await supabase.auth.signOut();

  return result;
}
