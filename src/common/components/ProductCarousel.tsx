"use client";

import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

// mui
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

// mui icons
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import BottomSheetCard from "./BottomSheetCard";
import BrandFilter, { type BrandFilterProps } from "./BrandFilter";
import { Button } from "@mui/material";

export type ProductCarouselItem = {
  id: number | string;
  imageSrc?: string;
  title: string;
  price?: number | string;
  tags?: string[];
  switchName?: string;
  showCheck?: boolean;
  showLike?: boolean;
  defaultChecked?: boolean;
  defaultLiked?: boolean;
  checked?: boolean;
  onCheckChange?: (checked: boolean) => boolean | void;
  onLikeChange?: (liked: boolean) => void;
};

type ProductCarouselProps = {
  title?: string;
  // 있으면 제목 자리에 브랜드 선택 드롭다운을 보여줌
  brandFilter?: BrandFilterProps;
  items: ProductCarouselItem[];
};

// 바텀시트에 들어가는 캐러셀
export default function ProductCarousel({
  title = "추천 상품",
  brandFilter,
  items,
}: ProductCarouselProps) {
  const [carouselRef, carouselApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    dragFree: false,
  });

  // 브랜드 필터로 목록이 바뀌면 캐러셀을 다시 계산하고 맨 앞으로 이동
  const itemKey = items.map((item) => item.id).join(",");
  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.reInit();
    carouselApi.scrollTo(0, true);
  }, [carouselApi, itemKey]);

  const scrollPrev = useCallback(() => {
    if (!carouselApi) return;
    carouselApi.scrollPrev();
  }, [carouselApi]);

  const scrollNext = useCallback(() => {
    if (!carouselApi) return;
    carouselApi.scrollNext();
  }, [carouselApi]);

  return (
    <Wrap>
      <TopRow>
        {brandFilter ? (
          <BrandFilter {...brandFilter} />
        ) : (
          <SectionTitle>{title}</SectionTitle>
        )}
      </TopRow>

      <CarouselOuter>
        <Viewport ref={carouselRef}>
          <Container>
            {items.map((item) => (
              <Slide key={item.id}>
                <BottomSheetCard
                  imageSrc={item.imageSrc}
                  title={item.title}
                  price={item.price}
                  tags={item.tags}
                  switchName={item.switchName}
                  showCheck={item.showCheck}
                  showLike={item.showLike}
                  defaultChecked={item.defaultChecked}
                  defaultLiked={item.defaultLiked}
                  checked={item.checked}
                  onCheckChange={item.onCheckChange}
                  onLikeChange={item.onLikeChange}
                />
              </Slide>
            ))}
          </Container>
        </Viewport>
      </CarouselOuter>

      <ArrowButton
        type="button"
        onClick={scrollPrev}
        aria-label="이전 상품 보기"
        side="left"
      >
        <ArrowLeftIcon />
      </ArrowButton>

      <ArrowButton
        type="button"
        onClick={scrollNext}
        aria-label="다음 상품 보기"
        side="right"
      >
        <ArrowRightIcon />
      </ArrowButton>

      <GotoButton type="button" variant="contained" color="inherit">
        <span>구매하러 가기</span>
      </GotoButton>
    </Wrap>
  );
}

const Wrap = styled(Box)(() => ({
  width: "90%",
  margin: "0 auto",
}));

const TopRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "24px",

  [theme.breakpoints.down("md")]: {
    marginBottom: "20px",
  },

  [theme.breakpoints.down("sm")]: {
    marginBottom: "16px",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 700,
  lineHeight: 1.2,
  color: theme.palette.text.primary,

  [theme.breakpoints.down("md")]: {
    fontSize: "1.2rem",
  },

  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
  },
}));

const CarouselOuter = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  overflow: "clip",

  [theme.breakpoints.down("md")]: {},

  // 모바일: 좌우 화살표가 카드와 겹치지 않도록 카드 영역 양옆에 여백
  [theme.breakpoints.down("sm")]: {
    width: "auto",
    margin: "0 32px",
  },
}));

const Viewport = styled("div")(() => ({
  overflow: "hidden",
  width: "100%",
}));

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  marginLeft: "-28px",

  [theme.breakpoints.down("md")]: {
    marginLeft: "-20px",
  },

  [theme.breakpoints.down("sm")]: {
    marginLeft: "-16px",
  },
}));

const Slide = styled("div")(({ theme }) => ({
  flex: "0 0 20%",
  minWidth: 0,
  paddingLeft: "28px",
  boxSizing: "border-box",

  [theme.breakpoints.down("md")]: {
    flex: "0 0 calc(100% / 3)",
    paddingLeft: "20px",
  },

  [theme.breakpoints.down("sm")]: {
    flex: "0 0 calc(100% / 2)",
    paddingLeft: "16px",
  },
}));

const ArrowButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "side",
})<{ side: "left" | "right" }>(({ theme, side }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  [side]: "3%",
  zIndex: 3,
  width: "44px",
  height: "44px",
  color: theme.palette.text.primary,

  "&:hover": {},

  "& svg": {
    fontSize: "32px",
  },

  [theme.breakpoints.down("sm")]: {
    [side]: "-6px",
    width: "36px",
    height: "36px",

    "& svg": {
      fontSize: "28px",
    },
  },
}));

const GotoButton = styled(Button)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  height: "40px",
  fontSize: "1rem",
  fontWeight: 500,
  border: `1px solid ${theme.palette.primary.main}`,
  background: theme.palette.primary.main,
  borderRadius: "5px",
  marginLeft: "auto",
  marginTop: "16px",

  transition: "color .3s ease",
  boxShadow: "none",

  display: "flex",
  justifyContent: "flex-end",

  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: theme.palette.background.default,
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform .4s ease",
    zIndex: 0,
  },

  "& span": {
    position: "relative",
    zIndex: 1,
    transition: "all .3s ease",
    color: theme.palette.background.default,
  },

  "&:hover": {
    boxShadow: "none !important",
  },

  "&:hover span": {
    color: theme.palette.primary.main,
  },

  "&:hover::before": {
    transform: "scaleX(1)",
  },
}));
