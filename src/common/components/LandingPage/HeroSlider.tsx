"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

// mui
import { styled } from "@mui/material/styles";

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
  useEffect(() => {
    if (!isPlaying || images.length < 2) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [isPlaying, images.length]);

  if (images.length === 0) return null;

  return (
    <SliderWrap role="region" aria-roledescription="carousel" aria-label="키보드 사진">
      <SlideViewport aria-live={isPlaying ? "off" : "polite"}>
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
                sizes="(max-width: 980px) 90vw, 560px"
                priority={index === 0}
                style={{ objectFit: "cover" }}
              />
            </Slide>
          );
        })}
      </SlideViewport>

      {images.length > 1 && (
        <ControlRow>
          <DotList>
            {images.map((image, index) => (
              <DotButton
                key={image.src}
                type="button"
                aria-label={`${index + 1}번째 사진 보기`}
                aria-current={index === currentIndex}
                onClick={() => setCurrentIndex(index)}
              >
                <span data-active={index === currentIndex} />
              </DotButton>
            ))}
          </DotList>

          <ToggleButton
            type="button"
            aria-label={isPlaying ? "슬라이드 자동 넘김 멈추기" : "슬라이드 자동 넘김 재생"}
            onClick={() => setUserPaused(isPlaying)}
          >
            {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
          </ToggleButton>
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
  gap: "6px",
}));

const SlideViewport = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "380px",
  borderRadius: "12px",
  overflow: "hidden",
  background: theme.palette.grey[100],
  boxShadow: "0 20px 48px rgba(29, 30, 36, 0.12)",

  [theme.breakpoints.down("md")]: {
    height: "340px",
  },

  [theme.breakpoints.down("sm")]: {
    height: "280px",
  },
}));

const Slide = styled("div")(() => ({
  position: "absolute",
  inset: 0,
  opacity: 0,
  transition: "opacity 700ms ease",

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

const DotList = styled("div")(() => ({
  display: "flex",
}));

const DotButton = styled("button")(({ theme }) => ({
  width: "44px",
  height: "44px",
  padding: 0,
  border: 0,
  background: "transparent",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "& span": {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    border: `2px solid ${theme.palette.primary.main}`,
    background: "transparent",
    transition: "background-color .3s ease",
  },

  "& span[data-active='true']": {
    background: theme.palette.primary.main,
  },

  "&:focus-visible": {
    outline: `3px solid ${theme.palette.primary.main}`,
    outlineOffset: "-6px",
    borderRadius: "50%",
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
