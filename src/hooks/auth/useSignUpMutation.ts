// 이메일과 비밀번호로 회원가입 요청을 처리하는 Mutation Hook

"use client";

import { useMutation } from "@tanstack/react-query";
import { signUpWithEmail } from "@/lib/api/auth/signUpWithEmail";

export function useSignUpMutation() {
  return useMutation({
    mutationFn: signUpWithEmail,
  });
}
