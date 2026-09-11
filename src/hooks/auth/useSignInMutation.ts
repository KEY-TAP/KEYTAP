// 이메일과 비밀번호로 로그인 요청을 처리하는 Mutation Hook

"use client";

import { useMutation } from "@tanstack/react-query";
import { signInWithEmail } from "@/lib/api/auth/signInWithEmail";

export function useSignInMutation() {
  return useMutation({
    mutationFn: signInWithEmail,
  });
}
