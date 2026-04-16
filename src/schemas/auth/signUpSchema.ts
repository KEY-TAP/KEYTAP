import { z } from "zod";

// 비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;

// 연락처는 숫자만 입력하며, 10자리 또는 11자리여야 합니다.
const phoneRegex = /^[0-9]{10,11}$/;

export const signUpSchema = z
  .object({
    // 이메일
    email: z
      .string()
      .trim()
      .min(1, "이메일을 입력해주세요.")
      .email("올바른 이메일 형식을 입력해주세요."),

    // 비밀번호
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(passwordRegex, "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다."),

    // 비밀번호 확인
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요."),

    // 개인 정보
    name: z.string().trim().min(1, "이름을 입력해주세요."),
    phone: z
      .string()
      .trim()
      .min(1, "연락처를 입력해주세요.")
      .regex(phoneRegex, "연락처는 숫자만 입력해주세요. (10~11자리)"),
    zipCode: z.string().trim().min(1, "우편번호를 입력해주세요."),
    address1: z.string().trim().min(1, "기본주소를 입력해주세요."),
    address2: z.string().trim().min(1, "상세주소를 입력해주세요."),

    // 약관 동의
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "이용약관에 동의해주세요.",
    }),
    agreePrivacy: z.boolean().refine((val) => val === true, {
      message: "개인정보 수집 및 이용에 동의해주세요.",
    }),
    agreeMarketing: z.boolean(),
  })

  // 비밀번호와 비밀번호 확인이 일치하는지 검증
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;
