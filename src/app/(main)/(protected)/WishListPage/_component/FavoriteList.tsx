"use client";

import { useEffect, useMemo, useState } from "react";

// mui
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// components
import CompareModal, { type CompareProduct } from "./CompareModal";
import ProductCard from "@/common/components/ProductCard";

// api
import { getCurrentUserId, unlikeProductClient } from "@/lib/api/likesClient";

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

interface LikedProduct {
  product_id: number;
  product_name: string;
  description: string | null;
  image_url: string | null;
  switches: SwitchOption[];
}

interface Props {
  products: LikedProduct[];
}

// 상품의 기본 스위치 (없으면 첫 번째 스위치)
function getDefaultSwitch(product: LikedProduct) {
  return (
    product.switches.find((sw) => sw.is_default) ?? product.switches[0] ?? null
  );
}

export default function FavoriteList({ products }: Props) {
  const [items, setItems] = useState<LikedProduct[]>(products);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUserId().then(setCurrentUserId);
  }, []);

  const hasItems = items.length > 0;

  // 비교 모달 셀렉트박스에 노출할 전체 옵션 (찜한 상품의 기본 스위치 기준)
  const compareOptions = useMemo<CompareProduct[]>(
    () =>
      items.map((product) => {
        const defaultSwitch = getDefaultSwitch(product);
        const longSound = defaultSwitch?.sounds.find(
          (s) => s.sound_type === "long",
        );

        return {
          id: product.product_id,
          title: defaultSwitch
            ? `${product.product_name} (${defaultSwitch.switch_name})`
            : product.product_name,
          imageSrc: product.image_url ?? undefined,
          description: product.description,
          soundLabel: defaultSwitch
            ? `${defaultSwitch.switch_name} 타건음 듣기`
            : "등록된 타건음 없음",
          soundUrl: longSound?.sound_url,
        };
      }),
    [items],
  );

  const compareItems = useMemo(() => {
    const matchedItems = compareOptions.filter((item) =>
      selectedIds.includes(item.id),
    );
    const fallbackItems = compareOptions.filter(
      (item) => !selectedIds.includes(item.id),
    );

    return [...matchedItems, ...fallbackItems].slice(0, 3);
  }, [compareOptions, selectedIds]);

  const compareModalKey = useMemo(
    () => compareItems.map((item) => item.id).join("-"),
    [compareItems],
  );

  const handleCheckChange = (itemId: number, checked: boolean) => {
    if (checked) {
      if (selectedIds.length >= 3) {
        setIsToastOpen(true);
        return false;
      }

      setSelectedIds((prev) => [...prev, itemId]);
      return true;
    }

    setSelectedIds((prev) => prev.filter((id) => id !== itemId));
    return true;
  };

  // 찜목록에서 하트를 다시 눌러 찜 해제 → 목록에서 제거
  const handleUnlike = async (productId: number) => {
    if (!currentUserId) return;

    try {
      await unlikeProductClient(currentUserId, productId);
      setItems((prev) => prev.filter((item) => item.product_id !== productId));
      setSelectedIds((prev) => prev.filter((id) => id !== productId));
    } catch {
      alert("찜 해제 중 오류가 발생했습니다.");
    }
  };

  const handleOpenCompare = () => {
    setIsCompareOpen(true);
  };

  const handleCloseCompare = () => {
    setIsCompareOpen(false);
  };

  const handleCloseToast = () => {
    setIsToastOpen(false);
  };

  return (
    <PageWrap>
      <Inner>
        <TopBar>
          <TitleWrap>
            <TitleBar />
            <TitleText variant="h2">찜 목록</TitleText>
          </TitleWrap>

          <CompareButton
            type="button"
            variant="contained"
            disableElevation
            onClick={handleOpenCompare}
          >
            한 눈에 비교하기
          </CompareButton>
        </TopBar>

        {hasItems ? (
          <GridList>
            {items.map((item) => (
              <CardItem key={item.product_id}>
                <ProductCard
                  imageSrc={item.image_url ?? undefined}
                  title={item.product_name}
                  showCheck
                  showLike
                  defaultChecked={false}
                  defaultLiked
                  onCheckChange={(checked) =>
                    handleCheckChange(item.product_id, checked)
                  }
                  onLikeChange={(liked) => {
                    if (!liked) handleUnlike(item.product_id);
                  }}
                />
              </CardItem>
            ))}
          </GridList>
        ) : (
          <EmptyText>담겨 있는 상품이 없습니다</EmptyText>
        )}
      </Inner>

      <CompareModal
        key={compareModalKey}
        open={isCompareOpen}
        onClose={handleCloseCompare}
        items={compareItems}
        options={compareOptions}
      />

      <Snackbar
        open={isToastOpen}
        autoHideDuration={2500}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseToast} severity="warning" variant="filled">
          최대 3개까지만 선택할 수 있습니다.
        </Alert>
      </Snackbar>
    </PageWrap>
  );
}

const PageWrap = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.common.white,
}));

const Inner = styled(Box)(() => ({
  width: "100%",
  margin: "0 auto",
  padding: "0 0 120px",
}));

const TopBar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "42px",

  [theme.breakpoints.down("md")]: {
    marginBottom: "35px",
  },

  [theme.breakpoints.down("sm")]: {
    marginBottom: "20px",
    flexDirection: "column",
    alignItems: "flex-start",
  },
}));

const TitleWrap = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "14px",

  [theme.breakpoints.down("md")]: {
    gap: "11px",
  },

  [theme.breakpoints.down("sm")]: {
    gap: "8px",
  },
}));

const TitleBar = styled("span")(({ theme }) => ({
  display: "inline-block",
  width: "3px",
  height: "24px",
  backgroundColor: theme.palette.primary.main,

  [theme.breakpoints.down("md")]: {
    height: "20px",
  },

  [theme.breakpoints.down("sm")]: {
    width: "2px",
    height: "16px",
  },
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 500,
  lineHeight: 1,
  letterSpacing: "-0.04em",
  color: "#000000",

  [theme.breakpoints.down("md")]: {
    fontSize: "1.2rem",
  },

  [theme.breakpoints.down("sm")]: {
    fontSize: "1.0rem",
  },
}));

const CompareButton = styled(Button)(({ theme }) => ({
  minWidth: "140px",
  height: "40px",
  padding: "0 20px",
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.grey[800],
  fontSize: "1rem",
  fontWeight: 500,
  borderRadius: "8px",
  boxShadow: "none",
  transition: "all .3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.default,
    transition: "all .3s ease",
    boxShadow: "none",
  },

  [theme.breakpoints.down("md")]: {},

  [theme.breakpoints.down("sm")]: {
    marginLeft: "auto",
  },
}));

const GridList = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  columnGap: "25px",
  rowGap: "25px",

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    columnGap: "20px",
    rowGap: "20px",
  },

  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
    columnGap: "15px",
    rowGap: "15px",
  },
}));

const CardItem = styled(Box)(() => ({
  width: "100%",
}));

const EmptyText = styled(Typography)(({ theme }) => ({
  padding: "120px 0",
  textAlign: "center",
  fontSize: "1.5rem",
  fontWeight: 500,
  color: theme.palette.text.secondary,

  [theme.breakpoints.down("md")]: {
    padding: "80px 0",
    fontSize: "1.2rem",
  },

  [theme.breakpoints.down("sm")]: {
    padding: "40px 0",
    fontSize: "1rem",
  },
}));
