// Nav
"use client";

import { styled } from "@mui/material/styles";
import Link from "next/link";

export default function Nav() {
  return (
    <NavWrap aria-label="주요 메뉴">
      <li>
        <Link href="/keyboards">Keyboards</Link>
      </li>
      <li>
        <Link href="/switches">Switches</Link>
      </li>
      <li>
        <Link href="/keycaps">KeyCaps</Link>
      </li>
      <li>
        <Link href="/accessories">Accessories</Link>
      </li>
    </NavWrap>
  );
}

// 스타일드 컴포넌트

const NavWrap = styled("ul")(({ theme }) => ({
  width: "100%",
  height: "100%",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  gap: "48px",

  "& li": {
    height: "100%",

    "& a": {
      height: "100%",
      padding: "30px 0",
      boxSizing: "border-box",
      display: "inline-block",

      color: theme.palette.grey[600],
      fontSize: "1rem",
      fontWeight: "500",

      transition: "all .3s ease",
    },

    "&:hover": {
      "& a": {
        color: theme.palette.primary.main,
      },
    },
  },
}));
