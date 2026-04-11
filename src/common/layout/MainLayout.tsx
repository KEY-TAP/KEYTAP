// MainLayout

"use client";

import { useState } from "react";
import BottomSheet from "./BottomSheet";
import ProductCarousel, { type ProductCarouselItem } from "../components/ProductCarousel";

// mui
import { styled } from "@mui/material/styles";

type Props = {
  children: React.ReactNode;
};

const mockItems: ProductCarouselItem[] = [
  {
    id: 1,
    imageSrc: "/noimg.png",
    title: "NUPHY [Magnetic Jade] Field75 HE 자석축 기계식 키보드 래피드 트리거",
    tags: ["로우하이듀얼", "커스텀키보드", "래피드트리거"],
    switchName: "민트축",
    showLike: true,
    defaultLiked: true,
  },
  {
    id: 2,
    imageSrc: "/noimg.png",
    title: "NUPHY Kick75 유무선 기계식 키보드",
    tags: ["로우하이듀얼", "커스텀키보드", "래피드트리거"],
    switchName: "저소음축",
    showLike: true,
    defaultLiked: false,
  },
  {
    id: 3,
    imageSrc: "/noimg.png",
    title: "NUPHY Air75 HE 초슬림 자석축 키보드",
    tags: ["로우하이듀얼", "커스텀키보드", "래피드트리거"],
    switchName: "실버축",
    showLike: true,
    defaultLiked: false,
  },
  {
    id: 4,
    imageSrc: "/noimg.png",
    title: "NUPHY Halo65 RGB 기계식 키보드",
    tags: ["로우하이듀얼", "커스텀키보드", "래피드트리거"],
    switchName: "옐로우축",
    showLike: true,
    defaultLiked: true,
  },
  {
    id: 5,
    imageSrc: "/noimg.png",
    title: "NUPHY Gem80 커스텀 키보드 베어본",
    tags: ["로우하이듀얼", "커스텀키보드", "래피드트리거"],
    switchName: "베어본",
    showLike: true,
    defaultLiked: false,
  },
  {
    id: 6,
    imageSrc: "/noimg.png",
    title: "NUPHY Wrist Rest 우드 팜레스트",
    tags: ["로우하이듀얼", "커스텀키보드", "래피드트리거"],
    switchName: "월넛",
    showLike: true,
    defaultLiked: false,
  },
  {
    id: 7,
    imageSrc: "/noimg.png",
    title: "NUPHY 77 우드 팜레스트",
    tags: ["로우하이듀얼", "커스텀키보드", "래피드트리거"],
    switchName: "월넛",
    showLike: true,
    defaultLiked: false,
  },
];

export default function MainLayout({ children }: Props) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleToggleBottomSheet = () => {
    setIsBottomSheetOpen((prev) => !prev);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  return (
    <>
      <MainWrap>{children}</MainWrap>

      <BottomSheet
        open={isBottomSheetOpen}
        onToggle={handleToggleBottomSheet}
        onClose={handleCloseBottomSheet}
      >
        <ProductCarousel title="NUPHY" items={mockItems} />
      </BottomSheet>
    </>
  );
}

const MainWrap = styled("main")(({ theme }) => ({
  width: "100%",
  margin: "0 auto",
  padding: "52px 10%",
  boxSizing: "border-box",

  [theme.breakpoints.down("md")]: {
    padding: "40px 5%",
  },

  [theme.breakpoints.down("sm")]: {
    padding: "30px 5%",
  },
}));
