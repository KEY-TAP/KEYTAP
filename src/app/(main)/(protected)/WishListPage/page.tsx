// 찜목록

import { Metadata } from "next";
import FavoriteList from "./_component/FavoriteList";

export const metadata: Metadata = {
  title: "찜목록 - Keytap",
  description: "찜목록 입니다",
  robots: "noindex, nofollow",
};

export default function WishList() {
  return <FavoriteList />;
}
