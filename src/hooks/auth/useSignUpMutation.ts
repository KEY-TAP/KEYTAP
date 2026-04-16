"use client";

import { useMutation } from "@tanstack/react-query";
import { signUpWithEmail } from "@/api/auth/signUpWithEmail";

export function useSignUpMutation() {
  return useMutation({
    mutationFn: signUpWithEmail,
  });
}
