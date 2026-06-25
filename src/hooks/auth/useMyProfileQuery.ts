// 유저 프로필 정보를 처리하는 Query Hook

"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/api/auth/getMyProfile";

export function useMyProfileQuery() {
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
  });
}
