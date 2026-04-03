// 메인페이지

import { Metadata } from "next";
import MainComponents from "../main/_component/MainComponents";

export const metadata: Metadata = {
  title: "메인페이지 - Keytap",
  description: "메인페이지 입니다",
  robots: "noindex, nofollow",
};

export default function MainPage() {
  return (
    <div>
      <MainComponents />
    </div>
  );
}
