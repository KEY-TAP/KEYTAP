// MainLayout

"use client";

import { useState } from "react";
import BottomSheet from "./BottomSheet";
import ProductCarousel, {
  type ProductCarouselItem,
} from "../components/ProductCarousel";
import { useProductStore } from "@/store/useProductStore";

// mui
import { styled } from "@mui/material/styles";

interface Sound {
  sound_id: number;
  sound_url: string;
  sound_type: string;
}

interface SwitchOption {
  switch_id: number;
  switch_name: string;
  switch_type: string;
  is_default: boolean;
  sounds: Sound[];
}

interface MainProduct {
  product_id: number;
  product_name: string;
  image_url: string | null;
  switches: SwitchOption[];
}

type Props = {
  children: React.ReactNode;
  products?: MainProduct[];
};

export default function MainLayout({ children, products = [] }: Props) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const { selectedProduct, setSelectedProduct } = useProductStore();

  const handleToggleBottomSheet = () => {
    setIsBottomSheetOpen((prev) => !prev);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  // 등록된 상품 → 캐러셀 아이템으로 매핑 (선택 시 타건음 재생용 상품으로 지정)
  const carouselItems: ProductCarouselItem[] = products.map((product) => ({
    id: product.product_id,
    imageSrc: product.image_url ?? undefined,
    title: product.product_name,
    showCheck: true,
    showLike: true,
    checked: selectedProduct?.product_id === product.product_id,
    onCheckChange: () => {
      setSelectedProduct(product);
    },
  }));

  return (
    <>
      <MainWrap>{children}</MainWrap>

      <BottomSheet
        open={isBottomSheetOpen}
        onToggle={handleToggleBottomSheet}
        onClose={handleCloseBottomSheet}
        thumbnailSrc={selectedProduct?.image_url}
      >
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
