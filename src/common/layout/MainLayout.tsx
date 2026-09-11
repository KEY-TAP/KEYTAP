// MainLayout

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomSheet from "./BottomSheet";
import ProductCarousel, {
  type ProductCarouselItem,
} from "../components/ProductCarousel";
import { useProductStore } from "@/store/useProductStore";
import {
  getCurrentUserId,
  likeProductClient,
  unlikeProductClient,
} from "@/lib/api/likesClient";

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
  likedProductIds?: number[];
};

export default function MainLayout({
  children,
  products = [],
  likedProductIds = [],
}: Props) {
  const router = useRouter();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const { selectedProduct, setSelectedProduct } = useProductStore();

  // 찜한 상품 id 목록 (서버에서 로그인 유저 기준으로 미리 받아옴, 클릭 시 로컬에서 갱신)
  const [likedIds, setLikedIds] = useState<Set<number>>(
    () => new Set(likedProductIds),
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUserId().then(setCurrentUserId);
  }, []);

  const handleToggleBottomSheet = () => {
    setIsBottomSheetOpen((prev) => !prev);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  // 찜하기 토글: 로그인 안 되어있으면 로그인 페이지로 이동, 되어있으면 DB에 반영
  const handleLikeChange = async (product: MainProduct, liked: boolean) => {
    if (!currentUserId) {
      router.push("/LoginPage");
      return;
    }

    try {
      if (liked) {
        await likeProductClient(currentUserId, product.product_id);
        setLikedIds((prev) => new Set(prev).add(product.product_id));
      } else {
        await unlikeProductClient(currentUserId, product.product_id);
        setLikedIds((prev) => {
          const next = new Set(prev);
          next.delete(product.product_id);
          return next;
        });
      }
    } catch {
      alert("찜하기 처리 중 오류가 발생했습니다.");
    }
  };

  // 등록된 상품 → 캐러셀 아이템으로 매핑 (선택 시 타건음 재생용 상품으로 지정)
  const carouselItems: ProductCarouselItem[] = products.map((product) => ({
    id: product.product_id,
    imageSrc: product.image_url ?? undefined,
    title: product.product_name,
    showCheck: true,
    showLike: true,
    checked: selectedProduct?.product_id === product.product_id,
    defaultLiked: likedIds.has(product.product_id),
    onCheckChange: () => {
      setSelectedProduct(product);
    },
    onLikeChange: (liked: boolean) => handleLikeChange(product, liked),
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
