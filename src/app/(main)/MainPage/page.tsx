// 메인페이지

import { Metadata } from "next";
import MainComponent from "./_component/MainComponents";

export const metadata: Metadata = {
  title: "메인페이지 - Keytap",
  description: "메인페이지 입니다",
  robots: "noindex, nofollow",
};

export default function MainPage() {
  return (
    <div>
      <MainComponent />
    </div>
  );
}
