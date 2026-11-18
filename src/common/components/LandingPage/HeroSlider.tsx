"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

// mui
import Tooltip from "@mui/material/Tooltip";
import { alpha, styled } from "@mui/material/styles";

export interface HeroImage {
  src: string;
  alt: string;
}

interface Props {
  // page.tsx에서 접속할 때마다 순서를 섞어서 내려줌
  images: HeroImage[];
}

// 다음 사진으로 넘어가는 간격
const SLIDE_INTERVAL = 4000;

// 이만큼(px) 이상 옆으로 밀면 다음/이전 사진으로 넘김
const SWIPE_THRESHOLD = 40;

// 움직임 줄이기 설정 구독 (설정이 바뀌면 바로 반영)
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const subscribeReducedMotion = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
};

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;

// 서버 렌더링 시에는 설정을 알 수 없으므로 기본값(자동 넘김)으로 처리
const getReducedMotionOnServer = () => false;

export default function HeroSlider({ images }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 사용자가 직접 멈춤/재생을 누른 값 (누르기 전에는 null)
  const [userPaused, setUserPaused] = useState<boolean | null>(null);

  // 움직임 줄이기 설정을 켠 사용자는 직접 재생하기 전까지 자동 넘김을 멈춤
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer,
  );
  const isPlaying =
    userPaused === null ? !prefersReducedMotion : !userPaused;

  // 자동 넘김 (멈춤 상태이거나 사진이 1장 이하면 동작 안 함)
  // 직접 넘긴 경우(currentIndex 변경)에도 간격을 처음부터 다시 셈
  useEffect(() => {
    if (!isPlaying || images.length < 2) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, SLIDE_INTERVAL);

    return () => clearTimeout(timer);
  }, [isPlaying, images.length, currentIndex]);

  // 터치로 옆으로 밀어서 넘기기 (마우스 드래그는 제외)
  const swipeStartX = useRef<number | null>(null);

  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);

  const handlePointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") return;
    swipeStartX.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (swipeStartX.current === null) return;

    const distance = event.clientX - swipeStartX.current;
    swipeStartX.current = null;

    if (images.length < 2 || Math.abs(distance) < SWIPE_THRESHOLD) return;
    if (distance < 0) goNext();
    else goPrev();
  };

  if (images.length === 0) return null;

  const toggleLabel = isPlaying ? "슬라이드 자동 넘김 멈추기" : "슬라이드 자동 넘김 재생";

  return (
    <SliderWrap role="region" aria-roledescription="carousel" aria-label="키보드 사진">
      <SlideViewport
        aria-live={isPlaying ? "off" : "polite"}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => (swipeStartX.current = null)}
      >
        {images.map((image, index) => {
          const isActive = index === currentIndex;

          return (
            <Slide
              key={image.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${images.length}`}
              aria-hidden={!isActive}
              data-active={isActive}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 980px) 90vw, 40vw"
                priority={index === 0}
                style={{ objectFit: "cover" }}
              />
            </Slide>
          );
        })}
      </SlideViewport>

      {images.length > 1 && (
        <ControlRow>
          {/* 이전·다음 버튼 + 현재 사진 번호 (< 1 / 4 >) */}
          <Counter>
            <ArrowButton type="button" aria-label="이전 사진 보기" onClick={goPrev}>
              <ChevronLeftRoundedIcon />
            </ArrowButton>
            <CounterText aria-hidden="true">
              <strong>{currentIndex + 1}</strong> / {images.length}
            </CounterText>
            <ArrowButton type="button" aria-label="다음 사진 보기" onClick={goNext}>
              <ChevronRightRoundedIcon />
            </ArrowButton>
          </Counter>

          <Tooltip title={toggleLabel}>
            <ToggleButton
              type="button"
              aria-label={toggleLabel}
              onClick={() => setUserPaused(isPlaying)}
            >
              {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
            </ToggleButton>
          </Tooltip>
        </ControlRow>
      )}
    </SliderWrap>
  );
}

// 스타일드 컴포넌트
const SliderWrap = styled("section")(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
}));

const SlideViewport = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  // 넓은 화면에서는 칸 너비에 맞춰 4:3 비율로 커짐
  aspectRatio: "4 / 3",
  borderRadius: "12px",
  overflow: "hidden",
  background: theme.palette.grey[100],
  border: `1px solid ${alpha(theme.palette.common.black, 0.08)}`,
  boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.06)}`,
  boxSizing: "border-box",
  // 세로 스크롤은 그대로, 가로로 미는 동작만 넘김에 사용
  touchAction: "pan-y",

  [theme.breakpoints.down("md")]: {
    aspectRatio: "auto",
    height: "320px",
  },

  [theme.breakpoints.down("sm")]: {
    height: "256px",
  },
}));

const Slide = styled("div")(() => ({
  position: "absolute",
  inset: 0,
  opacity: 0,
  transition: "opacity 300ms ease-out",

  "&[data-active='true']": {
    opacity: 1,
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
}));

const ControlRow = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const Counter = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
}));

const CounterText = styled("span")(({ theme }) => ({
  minWidth: "48px",
  textAlign: "center",
  fontSize: "0.9375rem",
  fontVariantNumeric: "tabular-nums",
  color: theme.palette.text.secondary,

  "& strong": {
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
}));

const ArrowButton = styled("button")(({ theme }) => ({
  width: "44px",
  height: "44px",
  padding: 0,
  border: 0,
  borderRadius: "50%",
  background: "transparent",
  color: theme.palette.text.primary,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color .3s ease",

  "@media (hover: hover)": {
    "&:hover": {
      background: theme.palette.secondary.main,
    },
  },

  "&:focus-visible": {
    outline: `3px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },
}));

const ToggleButton = styled("button")(({ theme }) => ({
  width: "44px",
  height: "44px",
  padding: 0,
  border: 0,
  borderRadius: "50%",
  background: "transparent",
  color: theme.palette.text.primary,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color .3s ease",

  "&:hover": {
    background: theme.palette.secondary.main,
  },

  "&:focus-visible": {
    outline: `3px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },
}));
