// MainLayout

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import BottomSheet from "./BottomSheet";
import ProductCarousel, {
  type ProductCarouselItem,
} from "../components/ProductCarousel";
import { useProductStore } from "@/store/useProductStore";
import { parseHashtags } from "@/utils/hashtags";
import {
  getCurrentUserId,
  likeProductClient,
  unlikeProductClient,
  updateLikedSwitchClient,
} from "@/lib/api/likesClient";

// mui
import { styled } from "@mui/material/styles";

interface Sound {
  sound_id: number;
  sound_url: string;
  sound_type: string;
}

interface SwitchOption {
  product_switch_id?: number;
  switch_id: number;
  switch_name: string;
  switch_type: string;
  is_default: boolean;
  sounds: Sound[];
}

interface MainProduct {
  product_id: number;
  product_name: string;
  hashtags?: string | null;
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
  const pathname = usePathname();

  // 바텀시트는 MainPage에서만 보여줌 (찜목록, 마이페이지 등에선 숨김)
  const isMainPage = pathname === "/MainPage";
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const { selectedProduct, selectedSwitchId, setSelectedProduct } =
    useProductStore();

  // 찜한 상품 id 목록 (서버에서 로그인 유저 기준으로 미리 받아옴, 클릭 시 로컬에서 갱신)
  const [likedIds, setLikedIds] = useState<Set<number>>(
    () => new Set(likedProductIds),
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUserId().then(setCurrentUserId);
  }, []);

  // 이전 선택 상태 (같은 상품 안에서 스위치만 바뀐 건지 구분하려고 저장)
  const prevSelectionRef = useRef<{
    productId: number | null;
    switchId: number | null;
  }>({ productId: null, switchId: null });

  // 이미 찜한 상품에서 스위치를 바꾸면 찜한 스위치도 같이 바꿔줌
  // (상품 자체를 새로 선택한 경우엔 찜 정보를 건드리지 않음)
  useEffect(() => {
    const prev = prevSelectionRef.current;
    const productId = selectedProduct?.product_id ?? null;
    prevSelectionRef.current = { productId, switchId: selectedSwitchId };

    if (!selectedProduct || !currentUserId) return;
    if (prev.productId !== productId || prev.switchId === selectedSwitchId) {
      return;
    }
    if (!likedIds.has(productId!)) return;

    const targetSwitch = selectedProduct.switches.find(
      (sw) => sw.switch_id === selectedSwitchId,
    );
    if (!targetSwitch?.product_switch_id) return;

    updateLikedSwitchClient(
      currentUserId,
      selectedProduct.product_id,
      targetSwitch.product_switch_id,
    ).catch(() => {
      alert("찜한 스위치 변경 중 오류가 발생했습니다.");
    });
  }, [selectedProduct, selectedSwitchId, currentUserId, likedIds]);

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
        // 지금 선택된 상품이면 선택한 스위치(청축 등)로, 아니면 기본 스위치로 찜
        const targetSwitch =
          selectedProduct?.product_id === product.product_id
            ? product.switches.find((sw) => sw.switch_id === selectedSwitchId)
            : product.switches.find((sw) => sw.is_default);

        await likeProductClient(
          currentUserId,
          product.product_id,
          targetSwitch?.product_switch_id,
        );
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
    // 상품 등록 때 입력한 해시태그를 바텀시트 카드에 노출
    tags: parseHashtags(product.hashtags),
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

      {isMainPage && (
        <BottomSheet
          open={isBottomSheetOpen}
          onToggle={handleToggleBottomSheet}
          onClose={handleCloseBottomSheet}
          thumbnailSrc={selectedProduct?.image_url}
        >
          <ProductCarousel title="NUPHY" items={carouselItems} />
        </BottomSheet>
      )}
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
