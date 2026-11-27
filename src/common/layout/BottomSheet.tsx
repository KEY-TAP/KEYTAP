// 하단 바텀 시트
"use client";

import React from "react";

// mui
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";

import MoreButton, { PillButton } from "../components/MoreButton";

type BottomSheetProps = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  // 닫혀 있을 때 오른쪽 아래 More 버튼을 보여줄지 (제품 정보 아래 More가 보이면 false)
  showFloatingMore?: boolean;
  children?: React.ReactNode;
};

export default function BottomSheet({
  open,
  onToggle,
  onClose,
  showFloatingMore = false,
  children,
}: BottomSheetProps) {
  return (
    <>
      <Dimmed open={open ? 1 : 0} onClick={onClose} />

      {/* 닫혀 있을 때: 오른쪽 아래 More 버튼 (가운데 정보 글자를 가리지 않도록) */}
      <MoreButton
        variant="floating"
        onClick={onToggle}
        expanded={open}
        hidden={open || !showFloatingMore}
      />

      <SheetWrap open={open ? 1 : 0}>
        {/* 열려 있을 때만 보이는 Close 버튼 */}
        <CloseButton
          type="button"
          onClick={onClose}
          aria-label="Close, 다른 키보드 목록 닫기"
          open={open ? 1 : 0}
        >
          Close
        </CloseButton>

        <SheetContent>{children}</SheetContent>
      </SheetWrap>
    </>
  );
}

const Dimmed = styled("button", {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: number }>(({ open }) => ({
  position: "fixed",
  inset: 0,
  zIndex: 1200,
  border: "none",
  padding: 0,
  margin: 0,
  background: "rgba(0, 0, 0, 0.55)",
  opacity: open ? 1 : 0,
  visibility: open ? "visible" : "hidden",
  transition: "all .3s ease",
  cursor: "pointer",
}));

const SheetWrap = styled("section", {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: number }>(({ theme, open }) => ({
  position: "fixed",
  left: 0,
  bottom: 0,
  width: "100%",
  zIndex: 1300,
  background: theme.palette.common.white,

  transform: open ? "translateY(0)" : "translateY(100%)",
  transition: "all .3s ease",
  boxShadow: "0 -10px 30px rgba(0,0,0,0.18)",
}));

// 열려 있을 때 시트 위 가운데에 보이는 Close 버튼 (More와 같은 모양)
const CloseButton = styled(PillButton, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: number }>(({ theme, open }) => ({
  position: "absolute",
  top: "-64px",
  left: "50%",
  transform: "translateX(-50%)",
  boxShadow: `0 8px 20px ${alpha(theme.palette.common.black, 0.12)}`,

  // 닫혀 있을 땐 숨김 (닫힌 상태는 More 버튼이 대신함)
  opacity: open ? 1 : 0,
  visibility: open ? "visible" : "hidden",
  pointerEvents: open ? "auto" : "none",

  [theme.breakpoints.down("sm")]: {
    top: "-56px",
  },
}));

const SheetContent = styled(Box)(({ theme }) => ({
  width: "90%",
  overflowY: "auto",
  padding: "24px 0",
  boxSizing: "border-box",
  margin: "0 auto",

  [theme.breakpoints.down("sm")]: {
    padding: "20px 0",
  },
}));
