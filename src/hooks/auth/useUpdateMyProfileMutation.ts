// 유저 프로필 정보를 업데이트하는 Mutation Hook

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyProfile } from "@/api/auth/updateMyProfile";

export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myProfile"],
      });
    },
  });
}
