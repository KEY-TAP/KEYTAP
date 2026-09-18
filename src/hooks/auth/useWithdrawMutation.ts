// 유저 계정을 탈퇴하는 Mutation Hook

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { withdraw } from "@/lib/api/auth/withdraw";

export function useWithdrawMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: withdraw,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
