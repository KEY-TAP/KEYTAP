// 회원가입 페이지

import { Metadata } from "next";
import SignUpForm from "./_component/SignUpForm";

export const metadata: Metadata = {
  title: "회원가입페이지 - Keytap",
  description: "Keytap에 회원가입하세요.",
  robots: "noindex, nofollow",
};

export default function SignUp() {
  return <SignUpForm />;
}
