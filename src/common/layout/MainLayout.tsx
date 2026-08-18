// MainLayout

"use client";

import { useState } from "react";
import BottomSheet from "./BottomSheet";
import ProductCarousel, { type ProductCarouselItem } from "../components/ProductCarousel";

// mui
import { styled } from "@mui/material/styles";

interface MainProduct {
  product_id: number;
  product_name: string;
  image_url: string | null;
  tags?: string[];
}

type Props = {
  children: React.ReactNode;
  products: MainProduct[];
};

export default function MainLayout({ children, products }: Props) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleToggleBottomSheet = () => {
    setIsBottomSheetOpen((prev) => !prev);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  const carouselItems: ProductCarouselItem[] = products.map((product) => ({
    id: product.product_id,
    imageSrc: product.image_url ?? "/noimg.png",
    title: product.product_name,
    tags: product.tags,
    showLike: true,
  }));

  return (
    <>
      <MainWrap>{children}</MainWrap>

      <BottomSheet open={isBottomSheetOpen} onToggle={handleToggleBottomSheet} onClose={handleCloseBottomSheet}>
        <ProductCarousel title="NUPHY" items={carouselItems} />
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
