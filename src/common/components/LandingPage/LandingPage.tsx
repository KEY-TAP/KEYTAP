"use client";

import Link from "next/link";
import Button from "@mui/material/Button";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HeroSlider, { type HeroImage } from "./HeroSlider";

// mui
import { styled } from "@mui/material/styles";

export interface LandingBrand {
  brand_id: number;
  brand_name: string;
  product_count: number;
}

interface Props {
  // 히어로 사진 (접속할 때마다 순서가 바뀜)
  heroImages: HeroImage[];
  // Explore Brands에 보여줄 브랜드 (등록 제품이 많은 순 최대 4개)
  brands: LandingBrand[];
}

const LandingPage = ({ heroImages, brands }: Props) => {
  return (
    <LandingWrap>
      {/* 히어로 */}
      <HeroSection>
        <HeroInner>
          <HeroText>
            <HeroTitle>
              Find Your
              <br />
              Perfect Typing Feel.
            </HeroTitle>
            <HeroDescription>
              키보드를 직접 경험하듯,
              <br />
              나에게 맞는 타건감을 발견하는 공간.
            </HeroDescription>
            <div>
              <StartButton
                component={Link}
                href="/MainPage"
                variant="contained"
                disableElevation
                endIcon={<ChevronRightRoundedIcon />}
              >
                지금 시작하기
              </StartButton>
            </div>
          </HeroText>

          <HeroMedia>
            <HeroSlider images={heroImages} />
          </HeroMedia>
        </HeroInner>
      </HeroSection>

      {/* 브랜드 */}
      {brands.length > 0 && (
        <BrandSection aria-labelledby="explore-brands-title">
          <BrandInner>
            <BrandHeading>
              <BrandTitle id="explore-brands-title">Explore Brands</BrandTitle>
              <BrandDescription>다양한 브랜드의 키보드를 만나보세요</BrandDescription>
            </BrandHeading>

            <BrandGrid>
              {brands.map((brand) => (
                <li key={brand.brand_id}>
                  {/* 해당 브랜드가 선택된 상태로 MainPage 열기 */}
                  <BrandCard href={`/MainPage?brand=${brand.brand_id}`}>
                    <BrandName>{brand.brand_name}</BrandName>
                    <BrandCount>등록 제품 {brand.product_count}개</BrandCount>
                  </BrandCard>
                </li>
              ))}
            </BrandGrid>
          </BrandInner>
        </BrandSection>
      )}
    </LandingWrap>
  );
};

export default LandingPage;

// 스타일드 컴포넌트
const LandingWrap = styled("main")(({ theme }) => ({
  width: "100%",
  background: theme.palette.background.default,
}));

// 히어로
const HeroSection = styled("section")(({ theme }) => ({
  width: "100%",
  background: theme.palette.background.subtle,
}));

const HeroInner = styled("div")(({ theme }) => ({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "64px 40px 80px",
  display: "flex",
  alignItems: "center",
  gap: "48px",
  boxSizing: "border-box",

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: "28px",
    padding: "48px 5% 56px",
  },

  [theme.breakpoints.down("sm")]: {
    gap: "20px",
    padding: "36px 24px 40px",
  },
}));

const HeroText = styled("div")(({ theme }) => ({
  flex: "1 1 600px",
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "24px",

  [theme.breakpoints.down("md")]: {
    flex: "none",
  },

  [theme.breakpoints.down("sm")]: {
    gap: "20px",
  },
}));

const HeroTitle = styled("h1")(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.h1.fontSize,
  fontWeight: theme.typography.h1.fontWeight,
  letterSpacing: theme.typography.h1.letterSpacing,
  lineHeight: 1.15,
  whiteSpace: "nowrap",
  color: theme.palette.primary.main,

  [theme.breakpoints.down("md")]: {
    fontSize: "2.5rem",
  },

  [theme.breakpoints.down("sm")]: {
    fontSize: "clamp(1.5rem, 7.4vw, 1.8125rem)",
    lineHeight: 1.2,
  },
}));

const HeroDescription = styled("p")(({ theme }) => ({
  margin: 0,
  fontSize: "1.1875rem",
  lineHeight: 1.6,
  color: theme.palette.text.primary,

  [theme.breakpoints.down("sm")]: {
    fontSize: "1.0625rem",
  },
}));

const StartButton = styled(Button)(({ theme }) => ({
  minHeight: "52px",
  padding: "0 28px",
  fontSize: "1.0625rem",

  "& .MuiButton-endIcon": {
    marginLeft: "4px",
  },

  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
})) as typeof Button;

const HeroMedia = styled("div")(({ theme }) => ({
  flex: "1 1 440px",
  minWidth: 0,

  [theme.breakpoints.down("md")]: {
    flex: "none",
  },
}));

// 브랜드
const BrandSection = styled("section")(({ theme }) => ({
  width: "100%",
  background: theme.palette.background.default,
}));

const BrandInner = styled("div")(({ theme }) => ({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "64px 40px 80px",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  boxSizing: "border-box",

  [theme.breakpoints.down("md")]: {
    padding: "56px 5% 64px",
  },

  [theme.breakpoints.down("sm")]: {
    gap: "24px",
    padding: "48px 24px 56px",
  },
}));

const BrandHeading = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
}));

const BrandTitle = styled("h2")(({ theme }) => ({
  margin: 0,
  fontSize: "2.25rem",
  fontWeight: theme.typography.h2.fontWeight,
  letterSpacing: theme.typography.h2.letterSpacing,
  color: theme.palette.primary.main,

  [theme.breakpoints.down("sm")]: {
    fontSize: "1.875rem",
  },
}));

const BrandDescription = styled("p")(({ theme }) => ({
  margin: 0,
  fontSize: "1rem",
  color: theme.palette.text.primary,

  [theme.breakpoints.down("sm")]: {
    fontSize: "0.9375rem",
  },
}));

const BrandGrid = styled("ul")(({ theme }) => ({
  margin: 0,
  padding: 0,
  listStyle: "none",
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "20px",

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },

  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: "14px",
  },
}));

const BrandCard = styled(Link)(({ theme }) => ({
  height: "100%",
  minHeight: "160px",
  padding: "24px",
  borderRadius: "12px",
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.default,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "40px",
  textDecoration: "none",
  color: theme.palette.text.primary,
  boxSizing: "border-box",
  transition: "border-color .3s ease",

  "&:hover": {
    borderColor: theme.palette.primary.main,
  },

  "&:focus-visible": {
    outline: `3px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },

  [theme.breakpoints.down("sm")]: {
    minHeight: "120px",
    padding: "20px",
    gap: "28px",
  },
}));

const BrandName = styled("span")(({ theme }) => ({
  fontSize: "1.375rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
  wordBreak: "keep-all",

  [theme.breakpoints.down("sm")]: {
    fontSize: "1.25rem",
  },
}));

const BrandCount = styled("span")(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.primary,
}));
