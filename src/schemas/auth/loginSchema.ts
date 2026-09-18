// 로그인 폼 유효성 검증 스키마

import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식을 입력해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
