// 바텀시트 브랜드 필터 (제목 자리에 들어가는 드롭다운)
"use client";

import { useId, useState } from "react";

// mui
import { styled, alpha } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export type BrandOption = {
  id: number;
  name: string;
};

export type BrandFilterProps = {
  options: BrandOption[];
  // null이면 전체 보기
  selectedId: number | null;
  onChange: (brandId: number | null) => void;
};

const ALL_LABEL = "전체";

export default function BrandFilter({
  options,
  selectedId,
  onChange,
}: BrandFilterProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const menuId = useId();

  const selectedName =
    options.find((option) => option.id === selectedId)?.name ?? ALL_LABEL;

  const handleSelect = (brandId: number | null) => {
    onChange(brandId);
    setAnchorEl(null);
  };

  return (
    <>
      <Trigger
        type="button"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-haspopup="true"
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
      >
        <span>{selectedName}</span>
        <ArrowDropDownIcon />
      </Trigger>

      <StyledMenu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        // 메뉴가 열려도 뒤 화면이 스크롤바 너비만큼 밀리지 않게
        disableScrollLock
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem
          selected={selectedId === null}
          onClick={() => handleSelect(null)}
        >
          {ALL_LABEL}
        </MenuItem>

        {options.map((option) => (
          <MenuItem
            key={option.id}
            selected={selectedId === option.id}
            onClick={() => handleSelect(option.id)}
          >
            {option.name}
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  );
}

// 기존 바텀시트 제목(SectionTitle)과 같은 글자 크기/굵기를 써서 제목 자리에 자연스럽게 들어가도록 함
const Trigger = styled(ButtonBase)(({ theme }) => ({
  ...theme.typography.body1,
  display: "inline-flex",
  alignItems: "center",
  gap: "2px",
  // 글자 위치는 기존 제목과 같게 두고, 호버 배경만 살짝 바깥으로 나오게
  margin: "-2px -4px",
  padding: "2px 2px 2px 4px",
  borderRadius: "5px",
  fontSize: "1.5rem",
  fontWeight: 700,
  lineHeight: 1.2,
  color: theme.palette.text.primary,
  transition: "background-color .2s ease",

  // 호버는 마우스 환경에서만 (바텀시트 토글 버튼과 같은 톤)
  "@media (hover: hover)": {
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
  },

  "&.Mui-focusVisible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },

  "& svg": {
    fontSize: "1.25em",
    transition: "transform .3s ease",
  },

  // 목록이 열려 있는 동안은 화살표가 위를 향함
  "&[aria-expanded='true'] svg": {
    transform: "rotate(180deg)",
  },

  [theme.breakpoints.down("md")]: {
    fontSize: "1.2rem",
  },

  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
  },

  "@media (prefers-reduced-motion: reduce)": {
    "& svg": { transition: "none" },
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    marginTop: "4px",
    minWidth: "160px",
    maxHeight: "320px",
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
  },

  "& .MuiMenuItem-root": {
    fontSize: "1rem",
    color: theme.palette.text.primary,
  },

  "& .MuiMenuItem-root.Mui-selected": {
    fontWeight: 700,
    color: theme.palette.primary.main,
  },
}));
