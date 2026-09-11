"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useProductStore } from "@/store/useProductStore";

// 이미지
import headphone01 from "../../../../public/headphone01.png";
import keyboard01h from "../../../../public/keyboard01-2.png";
import mouse01 from "../../../../public/mouse01.png";
import mobilePhone01 from "../../../../public/mobilephone01.png";
import keyboard02h from "../../../../public/keyboard02-2.png";
import headset01 from "../../../../public/headset01.png";

// mui
import { styled } from "@mui/material/styles";

// gsap 플러그인 등록
gsap.registerPlugin(useGSAP);

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

interface BubbleProduct {
  product_id: number;
  product_name: string;
  image_url: string | null;
  switches: SwitchOption[];
}

interface Props {
  // 인트로 말풍선 2개에 각각 표시할 랜덤 상품 (page.tsx에서 서버 렌더링 시점에 랜덤으로 선택되어 내려옴)
  bubbleProducts: BubbleProduct[];
}

const LandingPage = ({ bubbleProducts }: Props) => {
  const router = useRouter();
  const setSelectedProduct = useProductStore(
    (state) => state.setSelectedProduct,
  );

  const firstBubbleProduct = bubbleProducts[0];
  const secondBubbleProduct = bubbleProducts[1];

  // 말풍선(이미지) 클릭 시 해당 상품을 선택 상태로 만들고 MainPage로 이동
  const handleBubbleClick = (product?: BubbleProduct) => {
    if (!product) return;
    setSelectedProduct(product);
    router.push("/MainPage");
  };

  const rootRef = useRef<HTMLDivElement | null>(null);
  const imageWrapRef = useRef<HTMLDivElement | null>(null);
  const firstRowRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const wrap = imageWrapRef.current;
      const firstRow = firstRowRef.current;

      if (!wrap || !firstRow) return;

      let marqueeTween: gsap.core.Tween | null = null;

      const createMarquee = () => {
        const singleWidth = firstRow.offsetWidth;
        if (!singleWidth) return;

        if (marqueeTween) {
          marqueeTween.kill();
          gsap.set(wrap, { x: 0 });
        }

        marqueeTween = gsap.to(wrap, {
          x: -singleWidth,
          duration: 20,
          ease: "none",
          repeat: -1,
        });
      };

      createMarquee();

      const handleResize = () => {
        createMarquee();
      };

      window.addEventListener("resize", handleResize);

      const hoverItems = gsap.utils.toArray<HTMLElement>(".hover");
      const cleanups: Array<() => void> = [];

      hoverItems.forEach((item) => {
        const text = item.querySelector<HTMLElement>("p");
        if (!text) return;

        gsap.set(text, {
          x: 0,
          y: 0,
          autoAlpha: 0,
          scale: 0.96,
          pointerEvents: "none",
        });

        const getLocalPosition = (clientX: number, clientY: number) => {
          const rect = item.getBoundingClientRect();

          const tooltipWidth = text.offsetWidth;
          const tooltipHeight = text.offsetHeight;

          let x = clientX - rect.left;
          let y = clientY - rect.top;

          const minX = tooltipWidth / 2;
          const maxX = rect.width - tooltipWidth / 2;

          const minY = tooltipHeight + 12;
          const maxY = rect.height - 8;

          x = gsap.utils.clamp(minX, maxX, x);
          y = gsap.utils.clamp(minY, maxY, y);

          return { x, y };
        };

        const moveText = (clientX: number, clientY: number) => {
          const { x, y } = getLocalPosition(clientX, clientY);

          gsap.set(text, {
            x,
            y,
          });
        };

        const showTextAt = (clientX: number, clientY: number) => {
          const { x, y } = getLocalPosition(clientX, clientY);

          gsap.killTweensOf(text);

          gsap.set(text, {
            x,
            y,
            autoAlpha: 1,
            scale: 1,
          });
        };

        const hideText = () => {
          gsap.killTweensOf(text);

          gsap.to(text, {
            autoAlpha: 0,
            scale: 0.96,
            duration: 0.16,
            ease: "power2.out",
            overwrite: true,
          });
        };

        const pauseMarquee = () => {
          marqueeTween?.pause();
        };

        const resumeMarquee = () => {
          marqueeTween?.resume();
        };

        // PC
        const handleMouseEnter = (e: MouseEvent) => {
          pauseMarquee();
          showTextAt(e.clientX, e.clientY);
        };

        const handleMouseMove = (e: MouseEvent) => {
          moveText(e.clientX, e.clientY);
        };

        const handleMouseLeave = () => {
          hideText();
          resumeMarquee();
        };

        // Mobile
        const handleTouchStart = (e: TouchEvent) => {
          const touch = e.touches[0];
          if (!touch) return;

          pauseMarquee();
          showTextAt(touch.clientX, touch.clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
          const touch = e.touches[0];
          if (!touch) return;

          moveText(touch.clientX, touch.clientY);
        };

        const handleTouchEnd = () => {
          hideText();
          resumeMarquee();
        };

        item.addEventListener("mouseenter", handleMouseEnter);
        item.addEventListener("mousemove", handleMouseMove);
        item.addEventListener("mouseleave", handleMouseLeave);

        item.addEventListener("touchstart", handleTouchStart, {
          passive: true,
        });
        item.addEventListener("touchmove", handleTouchMove, { passive: true });
        item.addEventListener("touchend", handleTouchEnd);
        item.addEventListener("touchcancel", handleTouchEnd);

        cleanups.push(() => {
          item.removeEventListener("mouseenter", handleMouseEnter);
          item.removeEventListener("mousemove", handleMouseMove);
          item.removeEventListener("mouseleave", handleMouseLeave);

          item.removeEventListener("touchstart", handleTouchStart);
          item.removeEventListener("touchmove", handleTouchMove);
          item.removeEventListener("touchend", handleTouchEnd);
          item.removeEventListener("touchcancel", handleTouchEnd);
        });
      });

      return () => {
        marqueeTween?.kill();
        window.removeEventListener("resize", handleResize);
        cleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope: rootRef },
  );

  return (
    <LandingWrapper ref={rootRef}>
      <FlowArea>
        <ImageWrap ref={imageWrapRef}>
          <FlowRow ref={firstRowRef}>
            <div
              className="hover"
              onClick={() => handleBubbleClick(firstBubbleProduct)}
            >
              <Image src={keyboard01h} alt="키보드이미지" className="bubble" />
              {firstBubbleProduct && <p>{firstBubbleProduct.product_name}</p>}
              <Image src={headphone01} alt="헤드폰이미지" />
            </div>

            <div>
              <Image src={mouse01} alt="마우스 이미지" />
              <Image src={mobilePhone01} alt="핸드폰이미지" />
            </div>

            <div
              className="hover"
              onClick={() => handleBubbleClick(secondBubbleProduct)}
            >
              <Image src={headset01} alt="이어폰이미지" />
              <Image src={keyboard02h} alt="키보드이미지" className="bubble" />
              {secondBubbleProduct && <p>{secondBubbleProduct.product_name}</p>}
            </div>
          </FlowRow>

          <FlowRow aria-hidden="true">
            <div
              className="hover"
              onClick={() => handleBubbleClick(firstBubbleProduct)}
            >
              <Image src={keyboard01h} alt="키보드이미지" className="bubble" />
              {firstBubbleProduct && <p>{firstBubbleProduct.product_name}</p>}
              <Image src={headphone01} alt="헤드폰이미지" />
            </div>

            <div>
              <Image src={mouse01} alt="마우스 이미지" />
              <Image src={mobilePhone01} alt="핸드폰이미지" />
            </div>

            <div
              className="hover"
              onClick={() => handleBubbleClick(secondBubbleProduct)}
            >
              <Image src={headset01} alt="이어폰이미지" />
              <Image src={keyboard02h} alt="키보드이미지" className="bubble" />
              {secondBubbleProduct && <p>{secondBubbleProduct.product_name}</p>}
            </div>
          </FlowRow>
        </ImageWrap>
      </FlowArea>

      <ExamText>이미지를 클릭해 타건음을 체험해보세요.</ExamText>
    </LandingWrapper>
  );
};

export default LandingPage;

// 스타일드 컴포넌트
const LandingWrapper = styled("div")(() => ({
  width: "100%",
  height: "100vh",
  backgroundImage: "url(/background.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  overflow: "hidden",
  position: "relative",
}));

const FlowArea = styled("div")(() => ({
  overflow: "hidden",
  width: "100%",
  height: "100vh",
}));

const ImageWrap = styled("div")(() => ({
  position: "relative",
  display: "flex",
  width: "max-content",
  height: "100%",
  willChange: "transform",
}));

const ExamText = styled("p")(({ theme }) => ({
  position: "absolute",
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 9999,
  fontSize: "1.25rem",
  color: theme.palette.background.paper,
}));

const FlowRow = styled("div")(({ theme }) => ({
  minWidth: "max-content",
  height: "100vh",
  display: "flex",
  flexShrink: 0,
  gap: "80px",
  paddingRight: "80px",

  [theme.breakpoints.down("md")]: {
    gap: "40px",
    paddingRight: "40px",
  },

  "& > div": {
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,

    "&:first-of-type": {
      "& img:first-of-type": {
        [theme.breakpoints.down("md")]: {
          width: "670px",
        },

        [theme.breakpoints.down("sm")]: {
          width: "520px",
        },
      },
      "& img:last-of-type": {
        marginTop: "-280px",
        aspectRatio: "1/1",

        [theme.breakpoints.down("md")]: {
          width: "360px",
          marginTop: "-180px",
        },
        [theme.breakpoints.down("sm")]: {
          width: "260px",
          marginTop: "-120px",
        },
      },
    },

    "&:nth-of-type(2)": {
      justifyContent: "space-between",
      margin: "40px 0",
      flexShrink: 0,
    },

    "&:last-of-type": {
      "& img:first-of-type": {
        marginLeft: "auto",
        marginRight: "100px",
        marginTop: "170px",

        [theme.breakpoints.down("md")]: {
          width: "140px",
          marginRight: "60px",
        },
        [theme.breakpoints.down("sm")]: {
          width: "110px",
          marginRight: "20px",
          marginTop: "120px",
        },
      },
      "& img:last-of-type": {
        marginTop: "-140px",

        [theme.breakpoints.down("md")]: {
          width: "610px",
          marginTop: "-90px",
        },
        [theme.breakpoints.down("sm")]: {
          width: "500px",
          marginTop: "-50px",
        },
      },
    },

    "& img": {
      height: "auto",
      objectFit: "cover",
      flexShrink: 0,
      maxWidth: "none",
    },
  },

  "& .hover": {
    position: "relative",
    cursor: "pointer",
  },

  "& .hover p": {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    opacity: 1,

    fontSize: "1.25rem",
    fontWeight: "700",
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper,
    padding: "14px 40px",
    borderRadius: "24px 24px 24px 0",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    willChange: "transform, opacity",
    transform: "translate(-50%, calc(-100% - 12px))",

    [theme.breakpoints.down("md")]: {
      fontSize: "1.1rem",
      padding: "12px 30px",
      borderRadius: "22px 22px 22px 0",
    },

    [theme.breakpoints.down("sm")]: {
      fontSize: "1.1rem",
      padding: "10px 26px",
      borderRadius: "20px 20px 20px 0",
    },
  },

  "& .bubble": {
    transition: "opacity .3s ease",
    opacity: 0.4,
    position: "relative",
  },

  "& .hover:hover .bubble": {
    opacity: 1,
    cursor: "pointer",
  },
}));
