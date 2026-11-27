"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@mui/material/Button";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HeroSlider, { type HeroImage } from "./HeroSlider";

// mui
import { styled, alpha } from "@mui/material/styles";

export interface LandingBrand {
  brand_id: number;
  brand_name: string;
  // 카드 오른쪽 위 배경 이미지 (없으면 글자만 표시)
  image_url: string | null;
  product_count: number;
}

interface Props {
  // 히어로 사진 (접속할 때마다 순서가 바뀜)
  heroImages: HeroImage[];
  // 브랜드 영역에 보여줄 브랜드 (등록 제품이 많은 순 최대 4개)
  brands: LandingBrand[];
}

const LandingPage = ({ heroImages, brands }: Props) => {
  return (
    <LandingWrap>
      {/* 히어로 */}
      <HeroSection>
        <HeroText>
          <HeroCopy>
            <HeroTitle>
              사기 전에,
              <br />
              먼저 들어보세요.
            </HeroTitle>
            <HeroDescription>
              스위치마다 다른 타건음을 직접 눌러 비교하고
              <br />
              내 손에 맞는 키보드를 찾아보세요.
            </HeroDescription>
          </HeroCopy>
          <div>
            <StartButton
              component={Link}
              href="/MainPage"
              variant="contained"
              disableElevation
              endIcon={<ChevronRightRoundedIcon />}
            >
              키보드 소리 들으러 가기
            </StartButton>
          </div>
        </HeroText>

        <HeroMedia>
          <HeroSlider images={heroImages} />
        </HeroMedia>
      </HeroSection>

      {/* 브랜드 */}
      {brands.length > 0 && (
        <BrandSection aria-labelledby="brand-section-title">
          <BrandHeading>
            <BrandTitle id="brand-section-title">브랜드별로 들어보기</BrandTitle>
            <BrandDescription>브랜드를 고르면 그 브랜드 키보드만 모아서 보여드려요.</BrandDescription>
          </BrandHeading>

          <BrandGrid>
            {brands.map((brand) => (
              <li key={brand.brand_id}>
                {/* 해당 브랜드가 선택된 상태로 MainPage 열기 */}
                <BrandCard href={`/MainPage?brand=${brand.brand_id}`}>
                  {brand.image_url && (
                    <>
                      {/* 장식용 배경이라 화면 낭독기에서는 읽지 않음 (카드 이름은 브랜드명) */}
                      <BrandImage aria-hidden="true">
                        <Image
                          src={brand.image_url}
                          alt=""
                          fill
                          sizes="(max-width: 680px) 90vw, (max-width: 980px) 45vw, 20vw"
                        />
                      </BrandImage>
                      <BrandImageFade aria-hidden="true" />
                    </>
                  )}
                  <BrandName>{brand.brand_name}</BrandName>
                  <BrandCount>등록 제품 {brand.product_count}개</BrandCount>
                </BrandCard>
              </li>
            ))}
          </BrandGrid>
        </BrandSection>
      )}
    </LandingWrap>
  );
};

export default LandingPage;

// 스타일드 컴포넌트
// 좌우 여백은 MainPage(MainLayout)·푸터와 같은 10% / 5%로 맞춰 왼쪽 시작점을 통일함
const LandingWrap = styled("main")(({ theme }) => ({
  width: "100%",
  background: theme.palette.background.default,
  wordBreak: "keep-all",
}));

// 히어로
const HeroSection = styled("section")(({ theme }) => ({
  width: "100%",
  padding: "80px 10% 88px",
  // 글과 사진을 반반으로 나눠 넓은 화면에서도 둘 사이가 크게 벌어지지 않게 함
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
  alignItems: "center",
  gap: "64px",
  boxSizing: "border-box",
  background: theme.palette.background.subtle,

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "minmax(0, 1fr)",
    alignItems: "stretch",
    gap: "32px",
    padding: "48px 5% 56px",
  },

  [theme.breakpoints.down("sm")]: {
    padding: "40px 5% 48px",
  },
}));

const HeroText = styled("div")(({ theme }) => ({
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "32px",

  [theme.breakpoints.up("lg")]: {
    gap: "40px",
  },

  [theme.breakpoints.down("sm")]: {
    gap: "24px",
  },
}));

const HeroCopy = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",

  [theme.breakpoints.up("lg")]: {
    gap: "24px",
  },
}));

const HeroTitle = styled("h1")(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.h1.fontSize,
  fontWeight: theme.typography.h1.fontWeight,
  letterSpacing: theme.typography.h1.letterSpacing,
  lineHeight: 1.2,
  color: theme.palette.primary.main,

  // 넓은 화면에서는 커진 사진에 맞춰 글자도 키움
  [theme.breakpoints.up("lg")]: {
    fontSize: "3.5rem",
  },

  [theme.breakpoints.up("xl")]: {
    fontSize: "4rem",
  },

  [theme.breakpoints.down("md")]: {
    fontSize: "2.5rem",
  },

  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
}));

const HeroDescription = styled("p")(({ theme }) => ({
  margin: 0,
  fontSize: "1.125rem",
  lineHeight: 1.6,
  color: theme.palette.text.primary,

  [theme.breakpoints.up("lg")]: {
    fontSize: "1.25rem",
  },

  [theme.breakpoints.up("xl")]: {
    fontSize: "1.375rem",
  },

  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
  },
}));

const StartButton = styled(Button)(({ theme }) => ({
  minHeight: "48px",
  padding: "0 24px",
  fontSize: "1rem",

  "& .MuiButton-endIcon": {
    marginLeft: "4px",
  },

  // 키보드로 이동했을 때 포커스 위치가 잘 보이도록 테두리 표시
  "&.Mui-focusVisible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "3px",
  },

  [theme.breakpoints.up("lg")]: {
    minHeight: "56px",
    padding: "0 32px",
    fontSize: "1.125rem",
  },

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    minHeight: "44px",
  },
})) as typeof Button;

const HeroMedia = styled("div")(() => ({
  minWidth: 0,
}));

// 브랜드
const BrandSection = styled("section")(({ theme }) => ({
  width: "100%",
  padding: "80px 10%",
  boxSizing: "border-box",
  background: theme.palette.background.default,

  [theme.breakpoints.down("md")]: {
    padding: "56px 5% 64px",
  },

  [theme.breakpoints.down("sm")]: {
    padding: "48px 5% 56px",
  },
}));

const BrandHeading = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginBottom: "32px",

  [theme.breakpoints.down("sm")]: {
    marginBottom: "24px",
  },
}));

const BrandTitle = styled("h2")(({ theme }) => ({
  margin: 0,
  fontSize: "2.25rem",
  fontWeight: theme.typography.h2.fontWeight,
  letterSpacing: theme.typography.h2.letterSpacing,
  lineHeight: 1.2,
  color: theme.palette.primary.main,

  [theme.breakpoints.up("lg")]: {
    fontSize: "2.5rem",
  },

  [theme.breakpoints.up("xl")]: {
    fontSize: "2.75rem",
  },

  [theme.breakpoints.down("sm")]: {
    fontSize: "1.875rem",
  },
}));

const BrandDescription = styled("p")(({ theme }) => ({
  margin: 0,
  fontSize: "1rem",
  lineHeight: 1.5,
  color: theme.palette.text.primary,

  [theme.breakpoints.up("lg")]: {
    fontSize: "1.125rem",
  },
}));

const BrandGrid = styled("ul")(({ theme }) => ({
  margin: 0,
  padding: 0,
  listStyle: "none",
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "24px",

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },

  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
}));

const BrandCard = styled(Link)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  height: "100%",
  minHeight: "160px",
  padding: "24px",
  borderRadius: "12px",
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.default,
  display: "flex",
  flexDirection: "column",
  // 브랜드명은 카드 아래쪽, 등록 제품 수 바로 위에 둠 (위쪽은 배경 이미지 자리)
  justifyContent: "flex-end",
  gap: "6px",
  textDecoration: "none",
  color: theme.palette.text.primary,
  boxSizing: "border-box",
  transition: "border-color .2s ease-out",

  "&:hover": {
    borderColor: theme.palette.primary.main,
  },

  // 마우스를 올리면 배경 이미지가 살짝 커짐
  "@media (hover: hover)": {
    "&:hover img": {
      transform: "scale(1.05)",
    },
  },

  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },

  [theme.breakpoints.down("sm")]: {
    minHeight: "120px",
  },
}));

// 배경 이미지 영역: 카드 왼쪽 12%부터 오른쪽 끝, 위에서 72% 높이
const BrandImage = styled("span")(() => ({
  position: "absolute",
  top: 0,
  right: 0,
  left: "12%",
  height: "72%",

  "& img": {
    objectFit: "cover",
    objectPosition: "60% 70%",
    transformOrigin: "right top",
    transition: "transform .3s ease-out",
  },

  "@media (prefers-reduced-motion: reduce)": {
    "& img": { transition: "none" },
  },
}));

// 이미지가 왼쪽·아래로 흰 배경에 자연스럽게 사라지게 해서 글자가 잘 읽히도록 함
// (기존 카드 높이 160px 기준: 아래 42%까지는 흰색으로 덮어 브랜드명이 이미지 위에 겹치지 않게 함)
const BrandImageFade = styled("span")(({ theme }) => {
  const bg = theme.palette.background.default;

  return {
    position: "absolute",
    inset: 0,
    background: [
      `linear-gradient(90deg, ${bg} 0%, ${bg} 12%, ${alpha(bg, 0.55)} 30%, ${alpha(bg, 0)} 50%)`,
      `linear-gradient(0deg, ${bg} 0%, ${bg} 42%, ${alpha(bg, 0.6)} 52%, ${alpha(bg, 0)} 66%)`,
    ].join(", "),
  };
});

const BrandName = styled("span")(({ theme }) => ({
  position: "relative",
  fontSize: "1.375rem",
  fontWeight: 700,
  // 굵기는 그대로 두고 기울기만 추가
  fontStyle: "italic",
  lineHeight: 1.25,
  color: theme.palette.text.primary,

  // 4칸인데 카드 폭이 좁은 구간(980~1299px): 긴 브랜드명이 잘리지 않게 화면 폭에 맞춰 줄임
  [theme.breakpoints.between("md", "lg")]: {
    fontSize: "min(1.375rem, 1.75vw)",
  },

  [theme.breakpoints.up("lg")]: {
    fontSize: "1.5rem",
  },

  [theme.breakpoints.up("xl")]: {
    fontSize: "1.625rem",
  },

  [theme.breakpoints.down("sm")]: {
    fontSize: "1.25rem",
  },
}));

const BrandCount = styled("span")(({ theme }) => ({
  position: "relative",
  fontSize: "0.875rem",
  lineHeight: 1.4,
  color: theme.palette.text.primary,

  [theme.breakpoints.up("lg")]: {
    fontSize: "0.9375rem",
  },

  [theme.breakpoints.up("xl")]: {
    fontSize: "1rem",
  },
}));
