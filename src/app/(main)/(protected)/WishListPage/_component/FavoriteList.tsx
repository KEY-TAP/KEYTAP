"use client";

import { useMemo, useState } from "react";

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

type FavoriteListItem = {
  id: number;
  imageSrc?: string;
  title: string;
  price: number;
  defaultChecked?: boolean;
  defaultLiked?: boolean;
};

export default function FavoriteList() {
  const FavoriteListItems = useMemo<FavoriteListItem[]>(
    () => [
      {
        id: 1,
        title: "NUPHY [Magnetic Jade] Field75 HE 자석축 기계식 키보드 래피드 트리거",
        imageSrc: "/noimg.png",
        price: 299000,
        defaultChecked: true,
        defaultLiked: true,
      },
      {
        id: 2,
        title: "NUPHY [Magnetic Jade] Field75 HE 자석축 기계식 키보드 래피드 트리거",
        imageSrc: "/noimg.png",
        price: 299000,
        defaultChecked: false,
        defaultLiked: true,
      },
      {
        id: 3,
        title: "NUPHY [Magnetic Jade] Field75 HE 자석축 기계식 키보드 래피드 트리거",
        imageSrc: "/noimg.png",
        price: 299000,
        defaultChecked: true,
        defaultLiked: true,
      },
      {
        id: 4,
        title: "NUPHY [Magnetic Jade] Field75 HE 자석축 기계식 키보드 래피드 트리거",
        imageSrc: "/noimg.png",
        price: 299000,
        defaultChecked: false,
        defaultLiked: true,
      },
      {
        id: 5,
        title: "NUPHY [Magnetic Jade] Field75 HE 자석축 기계식 키보드 래피드 트리거",
        imageSrc: "/noimg.png",
        price: 299000,
        defaultChecked: false,
        defaultLiked: true,
      },
      {
        id: 6,
        title: "NUPHY [Magnetic Jade] Field75 HE 자석축 기계식 키보드 래피드 트리거",
        imageSrc: "/noimg.png",
        price: 299000,
        defaultChecked: true,
        defaultLiked: true,
      },
    ],
    [],
  );

  // 비교 모달 목업데이터
  const compareOptions = useMemo<CompareProduct[]>(
    () => [
      {
        id: 1,
        title: "NUPHY Field75 HE 마그네틱 화이트축",
        imageSrc: "/noimg.png",
        price: 269000,
        colorName: "스페이스 그레이",
        colorChips: ["#A9A9A9"],
        soundLabel: "마그네틱 화이트축 타건음 듣기",
        features: [
          "로우&하이 프로파일 교체",
          "3D 프린팅 오픈소스",
          "유/무선(2.4G) 블루투스 연결",
          "커스터마이징(보강판, 키캡, 스위치)",
          "2,500mAh 배터리 용량",
          "스마트 노브 커스텀",
        ],
      },
      {
        id: 2,
        title: "NUPHY Field75 HE 마그네틱 제이드축",
        imageSrc: "/noimg.png",
        price: 269000,
        colorName: "스페이스 그레이",
        colorChips: ["#A9A9A9"],
        soundLabel: "마그네틱 제이드축 타건음 듣기",
        features: [
          "로우&하이 프로파일 교체",
          "3D 프린팅 오픈소스",
          "유/무선(2.4G) 블루투스 연결",
          "커스터마이징(보강판, 키캡, 스위치)",
          "2,500mAh 배터리 용량",
          "스마트 노브 커스텀",
        ],
      },
      {
        id: 3,
        title: "NUPHY AIR75 V2 갈축",
        price: 269000,
        colorName: "아이오닉 화이트",
        colorChips: ["#A9A9A9", "#000000", "#FFFFFF"],
        imageSrc: "/noimg.png",
        soundLabel: "갈축 타건음 듣기",
        features: [
          "로우&하이 프로파일 교체",
          "3D 프린팅 오픈소스",
          "유/무선(2.4G) 블루투스 연결",
          "커스터마이징(보강판, 키캡, 스위치)",
          "2,500mAh 배터리 용량",
          "스마트 노브 커스텀",
        ],
      },
    ],
    [],
  );

  const [selectedIds, setSelectedIds] = useState<number[]>([1, 3, 6]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);

  const hasItems = FavoriteListItems.length > 0;

  const compareItems = useMemo(() => {
    const matchedItems = compareOptions.filter((item) => selectedIds.includes(item.id));
    const fallbackItems = compareOptions.filter((item) => !selectedIds.includes(item.id));

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
            {FavoriteListItems.map((item) => (
              <CardItem key={item.id}>
                <ProductCard
                  imageSrc={item.imageSrc}
                  title={item.title}
                  price={item.price}
                  showCheck
                  showLike
                  defaultChecked={item.defaultChecked}
                  defaultLiked={item.defaultLiked}
                  onCheckChange={(checked) => handleCheckChange(item.id, checked)}
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
