// 유저 이메일과 비밀번호를 사용하여 로그인하는 API

import { supabase } from "@/lib/supabaseClient";
import type { LoginFormValues } from "@/schemas/auth/loginSchema";

type SignInWithEmailResult = {
  userId: string;
  email: string;
};

export async function signInWithEmail(values: LoginFormValues): Promise<SignInWithEmailResult> {
  const { email, password } = values;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const message = error.message.toLowerCase();

    if (message.includes("invalid login credentials")) {
      throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    throw new Error(error.message);
  }

  if (!data.user?.id || !data.user.email) {
    throw new Error("로그인 사용자 정보를 가져오지 못했습니다.");
  }

  return {
    userId: data.user.id,
    email: data.user.email,
  };
}
