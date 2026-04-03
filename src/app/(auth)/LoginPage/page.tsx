// 로그인페이지

import type { Metadata } from "next";
import LoginForm from "./_component/LoginForm";

export const metadata: Metadata = {
  title: "로그인 - Keytap",
  description: "Keytap에 로그인하세요.",
  robots: "noindex, nofollow",
};

export default function Login() {
  return <LoginForm />;
}
