// 하단 바텀 시트
"use client";

import React, { useState } from "react";

// mui
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

type BottomSheetProps = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  children?: React.ReactNode;
  thumbnailSrc?: string | null;
};

export default function BottomSheet({
  open,
  onToggle,
  onClose,
  children,
  thumbnailSrc,
}: BottomSheetProps) {
  // 한 번이라도 열어봤으면 화살표 움직임으로 알려주는 안내는 더 이상 안 보여줌
  const [hasOpened, setHasOpened] = useState(false);
  if (open && !hasOpened) setHasOpened(true);

  return (
    <>
      <Dimmed open={open ? 1 : 0} onClick={onClose} />

      <SheetWrap open={open ? 1 : 0}>
        <ToggleButton
          type="button"
          onClick={onToggle}
          aria-label="바텀 시트 토글"
        >
          {thumbnailSrc && <HandleThumbnail src={thumbnailSrc} alt="" />}

          <KeyboardIcon open={open ? 1 : 0} nudge={!open && !hasOpened}>
            <ArrowDropDownIcon />
          </KeyboardIcon>
        </ToggleButton>

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

const ToggleButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "-48px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "202px",
  height: "48px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  borderTopLeftRadius: "10px",
  borderTopRightRadius: "10px",
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  background: theme.palette.secondary.main,
  boxShadow: "none",

  transition: "background-color .2s ease",
  // 호버는 마우스 환경에서만: 배경이 살짝 진해짐
  "@media (hover: hover)": {
    "&:hover": {
      background: theme.palette.secondary.main,
      backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.08)})`,
    },
  },

  [theme.breakpoints.down("sm")]: {
    width: "120px",
    height: "36px",
    top: "-36px",
    gap: "6px",
  },
}));

const HandleThumbnail = styled("img")(({ theme }) => ({
  width: "28px",
  height: "28px",
  borderRadius: "5px",
  objectFit: "cover",
  flexShrink: 0,

  [theme.breakpoints.down("sm")]: {
    width: "20px",
    height: "20px",
  },
}));

const KeyboardIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "nudge",
})<{ open?: number; nudge?: boolean }>(({ theme, open, nudge }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.black,
  // 시트가 내려가 있을 땐 ▲(올리기), 올라와 있을 땐 ▼(내리기)
  transform: open ? "rotate(0deg)" : "rotate(180deg)",
  transition: "transform .3s ease",

  "& svg": {
    fontSize: "30px",
    // 아직 안 열어본 동안만 화살표가 위로 살짝 움직임 (3번 반복 후 멈춤)
    // 부모가 180도 돌아가 있어서 아래(+)로 움직이면 화면에서는 위로 보임
    animation: nudge ? "sheetArrowNudge 2.4s ease-in-out 3" : "none",
  },

  "@keyframes sheetArrowNudge": {
    "0%, 60%, 100%": { transform: "translateY(0)" },
    "20%": { transform: "translateY(4px)" },
    "40%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(2px)" },
  },

  "@media (prefers-reduced-motion: reduce)": {
    "& svg": { animation: "none" },
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
