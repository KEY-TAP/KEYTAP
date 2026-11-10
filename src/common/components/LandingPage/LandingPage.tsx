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
              스위치마다 다른 타건음을 직접 눌러 비교하고, 내 손에 맞는 키보드를 찾아보세요.
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
  display: "flex",
  alignItems: "center",
  gap: "64px",
  boxSizing: "border-box",
  background: theme.palette.background.subtle,

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: "32px",
    padding: "48px 5% 56px",
  },

  [theme.breakpoints.down("sm")]: {
    padding: "40px 5% 48px",
  },
}));

const HeroText = styled("div")(({ theme }) => ({
  flex: "1 1 0",
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "32px",

  [theme.breakpoints.down("md")]: {
    flex: "none",
  },

  [theme.breakpoints.down("sm")]: {
    gap: "24px",
  },
}));

const HeroCopy = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
}));

const HeroTitle = styled("h1")(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.h1.fontSize,
  fontWeight: theme.typography.h1.fontWeight,
  letterSpacing: theme.typography.h1.letterSpacing,
  lineHeight: 1.2,
  color: theme.palette.primary.main,

  [theme.breakpoints.down("md")]: {
    fontSize: "2.5rem",
  },

  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
}));

const HeroDescription = styled("p")(({ theme }) => ({
  margin: 0,
  maxWidth: "32ch",
  fontSize: "1.125rem",
  lineHeight: 1.6,
  color: theme.palette.text.primary,

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

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    minHeight: "52px",
  },
})) as typeof Button;

const HeroMedia = styled("div")(({ theme }) => ({
  flex: "0 0 480px",
  minWidth: 0,

  [theme.breakpoints.down("md")]: {
    flex: "none",
  },
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

  [theme.breakpoints.down("sm")]: {
    fontSize: "1.875rem",
  },
}));

const BrandDescription = styled("p")(({ theme }) => ({
  margin: 0,
  fontSize: "1rem",
  lineHeight: 1.5,
  color: theme.palette.text.primary,
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
  transition: "border-color .2s ease-out",

  "&:hover": {
    borderColor: theme.palette.primary.main,
  },

  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },

  [theme.breakpoints.down("sm")]: {
    minHeight: "120px",
    gap: "24px",
  },
}));

const BrandName = styled("span")(({ theme }) => ({
  fontSize: "1.375rem",
  fontWeight: 700,
  lineHeight: 1.25,
  color: theme.palette.text.primary,

  [theme.breakpoints.down("sm")]: {
    fontSize: "1.25rem",
  },
}));

const BrandCount = styled("span")(({ theme }) => ({
  fontSize: "0.875rem",
  lineHeight: 1.4,
  color: theme.palette.text.primary,
}));
