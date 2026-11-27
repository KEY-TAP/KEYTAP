// 바텀시트(다른 키보드 목록)를 여닫는 글자 버튼
// - MoreButton floating: 화면 오른쪽 아래에 떠 있는 More (제품 정보 아래 More가 안 보일 때만 표시)
// - MoreButton inline: 제품 정보(안내 문구) 아래에 놓이는 More
// - PillButton: More / Close가 같이 쓰는 기본 모양 (BottomSheet의 Close 버튼에서 사용)
"use client";

import { styled, alpha } from "@mui/material/styles";

type MoreButtonProps = {
  variant: "floating" | "inline";
  onClick: () => void;
  // 바텀시트가 열려 있는지 (화면 낭독기용)
  expanded?: boolean;
  // floating 전용: 숨김 여부
  hidden?: boolean;
};

export default function MoreButton({
  variant,
  onClick,
  expanded = false,
  hidden = false,
}: MoreButtonProps) {
  const Button = variant === "floating" ? FloatingButton : InlineButton;

  return (
    <Button
      type="button"
      onClick={onClick}
      // 보이는 글자(More)를 포함한 이름 + 의미 설명
      aria-label="More, 다른 키보드 보기"
      aria-expanded={expanded}
      hide={hidden ? 1 : 0}
    >
      More
    </Button>
  );
}

type StyleProps = { hide?: number };

export const PillButton = styled("button", {
  shouldForwardProp: (prop) => prop !== "hide",
})<StyleProps>(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: "48px",
  padding: "0 24px",
  borderRadius: "999px",
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.common.white,
  color: theme.palette.primary.main,
  fontFamily: "inherit",
  fontSize: "1rem",
  fontWeight: 600,
  lineHeight: 1,
  cursor: "pointer",
  transition: "background-color .2s ease, opacity .2s ease, transform .2s ease, visibility .2s",

  // 호버는 마우스 환경에서만: 배경이 살짝 진해짐
  "@media (hover: hover)": {
    "&:hover": {
      backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.08)})`,
    },
  },

  // 키보드로 이동했을 때 포커스 위치 표시
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },

  [theme.breakpoints.down("sm")]: {
    height: "44px",
    padding: "0 20px",
  },
}));

const FloatingButton = styled(PillButton)<StyleProps>(({ theme, hide }) => ({
  position: "fixed",
  // 콘텐츠 오른쪽 끝에 맞춤 (MainLayout 좌우 여백 10% / 5%와 같음)
  right: "10%",
  bottom: "24px",
  zIndex: 1250,
  boxShadow: `0 8px 20px ${alpha(theme.palette.common.black, 0.12)}`,
  opacity: hide ? 0 : 1,
  transform: hide ? "translateY(8px)" : "none",
  visibility: hide ? "hidden" : "visible",
  pointerEvents: hide ? "none" : "auto",

  [theme.breakpoints.down("md")]: {
    right: "5%",
  },

  [theme.breakpoints.down("sm")]: {
    bottom: "16px",
  },
}));

const InlineButton = styled(PillButton)<StyleProps>(({ theme }) => ({
  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
}));
