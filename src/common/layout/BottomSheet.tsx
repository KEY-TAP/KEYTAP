// 하단 바텀 시트
"use client";

import React from "react";

// mui
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

type BottomSheetProps = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  children?: React.ReactNode;
};

export default function BottomSheet({ open, onToggle, onClose, children }: BottomSheetProps) {
  return (
    <>
      <Dimmed open={open ? 1 : 0} onClick={onClose} />

      <SheetWrap open={open ? 1 : 0}>
        <ToggleButton type="button" onClick={onToggle} aria-label="바텀 시트 토글">
          <KeyboardIcon open={open ? 1 : 0}>
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
  borderTopLeftRadius: "10px",
  borderTopRightRadius: "10px",
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  background: theme.palette.secondary.main,
  boxShadow: "none",

  "&:hover": {
    background: theme.palette.secondary.main,
  },

  [theme.breakpoints.down("sm")]: {
    width: "120px",
    height: "36px",
    top: "-36px",
  },
}));

const KeyboardIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: number }>(({ theme, open }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.black,
  transform: open ? "rotate(180deg)" : "rotate(0deg)",
  transition: "transform .3s ease",

  "& svg": {
    fontSize: "30px",
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
