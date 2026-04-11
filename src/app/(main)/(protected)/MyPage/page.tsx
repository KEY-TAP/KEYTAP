// 마이페이지

import { Metadata } from "next";
import ProfileForm from "./_component/ProfileForm";

export const metadata: Metadata = {
  title: "마이페이지 - Keytap",
  description: "마이페이지 입니다",
  robots: "noindex, nofollow",
};

export default function MyPage() {
  return <ProfileForm />;
}
