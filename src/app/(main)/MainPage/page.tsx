// 메인페이지

import { Metadata } from "next";
import { getMainProducts } from "@/lib/api/mainProducts";
import MainComponent from "./_component/MainComponents";

export const metadata: Metadata = {
  title: "메인페이지 - Keytap",
  description: "메인페이지 입니다",
  robots: "noindex, nofollow",
};

export default async function MainPage() {
  // 서버에서 제품 목록 fetch
  const products = await getMainProducts();
  return (
    <div>
      <MainComponent products={products} />
    </div>
  );
}
