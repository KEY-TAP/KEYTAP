// 회원가입, 인증 관련 유효성 검사 스키마

import { z } from "zod";

//** 회원가입 시 비밀번호 유효성 검사 **/

// 비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.
export const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;

export const passwordSchema = z
  .string()
  .min(8, "비밀번호는 8자 이상이어야 합니다.")
  .regex(passwordRegex, "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.");

export const nameSchema = z.string().trim().min(1, "이름을 입력해주세요.");

export const agreeTermsSchema = z.boolean().refine((val) => val === true, {
  message: "이용약관에 동의해주세요.",
});

export const agreePrivacySchema = z.boolean().refine((val) => val === true, {
  message: "개인정보 수집 및 이용에 동의해주세요.",
});

export const passwordConfirmSchema = z.string().min(1, "비밀번호 확인을 입력해주세요.");

export const signUpSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "이메일을 입력해주세요.")
      .email("올바른 이메일 형식을 입력해주세요."),

    password: passwordSchema,
    passwordConfirm: passwordConfirmSchema,

    name: nameSchema,

    agreeTerms: agreeTermsSchema,
    agreePrivacy: agreePrivacySchema,
    agreeMarketing: z.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;

//** 프로필 변경시 유효성 검사 **//
export type PasswordChangeFields = {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
};

export const hasPasswordChangeInput = (values: PasswordChangeFields) => {
  return (
    values.currentPassword.trim().length > 0 ||
    values.password.trim().length > 0 ||
    values.passwordConfirm.trim().length > 0
  );
};

const addCustomIssue = (ctx: z.RefinementCtx, path: Array<string | number>, message: string) => {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    path,
    message,
  });
};

export const profileUpdateSchema = z
  .object({
    name: nameSchema,

    currentPassword: z.string(),
    password: z.string(),
    passwordConfirm: z.string(),

    agreeTerms: agreeTermsSchema,
    agreePrivacy: agreePrivacySchema,
    agreeMarketing: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const shouldValidatePassword = hasPasswordChangeInput({
      currentPassword: data.currentPassword,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });

    // 비밀번호 입력값이 전부 비어 있으면 비밀번호 변경 검사는 하지 않음
    if (!shouldValidatePassword) return;

    if (!data.currentPassword.trim()) {
      addCustomIssue(ctx, ["currentPassword"], "현재 비밀번호를 입력해주세요.");
    }

    if (!data.password.trim()) {
      addCustomIssue(ctx, ["password"], "새 비밀번호를 입력해주세요.");
    } else {
      const passwordResult = passwordSchema.safeParse(data.password);

      if (!passwordResult.success) {
        passwordResult.error.issues.forEach((issue) => {
          addCustomIssue(ctx, ["password"], issue.message);
        });
      }
    }

    if (!data.passwordConfirm.trim()) {
      addCustomIssue(ctx, ["passwordConfirm"], "비밀번호 확인을 입력해주세요.");
    }

    if (data.currentPassword && data.password && data.currentPassword === data.password) {
      addCustomIssue(ctx, ["password"], "이전 비밀번호와 똑같습니다.");
    }

    if (data.password && data.passwordConfirm && data.password !== data.passwordConfirm) {
      addCustomIssue(ctx, ["passwordConfirm"], "비밀번호가 일치하지 않습니다.");
    }
  });

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;

//** 회원 탈퇴 시 유효성 검사 **/
export const withdrawSchema = z.object({
  password: z.string().refine((value) => value.trim().length > 0, {
    message: "비밀번호를 입력해주세요.",
  }),
});

export type WithdrawFormValues = z.infer<typeof withdrawSchema>;
