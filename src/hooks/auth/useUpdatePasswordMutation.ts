// 유저 비밀번호를 업데이트(변경)하는 Mutation Hook

"use client";

import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/lib/api/auth/updatePassword";

export function useUpdatePasswordMutation() {
  return useMutation({
    mutationFn: updatePassword,
  });
}
