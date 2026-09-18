"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

// mui-icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import KeyboardAltOutlinedIcon from "@mui/icons-material/KeyboardAltOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

// 로고
import logoImage from "../../../../public/logo.png";

const menuItems = [
  { label: "대시보드", href: "/admin", icon: <HomeOutlinedIcon /> },
  { label: "상품 관리", href: "/admin/products", icon: <AddBoxOutlinedIcon /> },
  { label: "브랜드 관리", href: "/admin/brands", icon: <LocalOfferOutlinedIcon /> },
  { label: "스위치 등록", href: "/admin/switches", icon: <KeyboardAltOutlinedIcon /> },
  { label: "유저 관리", href: "/admin/users", icon: <PeopleAltOutlinedIcon /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Aside>
      <LogoWrap>
        <Link href="/admin" passHref>
          <Image src={logoImage} alt="KEYTAP" />
        </Link>
      </LogoWrap>
      <nav>
        {menuItems.map((item) => (
          <MenuItem
            key={item.href}
            component={Link}
            href={item.href}
            isActive={pathname === item.href}
          >
            {item.icon}
            {item.label}
          </MenuItem>
        ))}
      </nav>
    </Aside>
  );
}

// 스타일드 컴포넌트
const Aside = styled("aside")(({ theme }) => ({
  width: "200px",
  borderRight: `1px solid ${theme.palette.divider}`,
  boxSizing: "border-box",
  backgroundColor: theme.palette.background.default,
}));

const LogoWrap = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  padding: "25px 24px",
  boxSizing: "border-box",

  "& img": {
    width: "100%",
    height: "auto",
    maxWidth: "149px",
  },
}));

const MenuItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ component?: React.ElementType; href?: string; isActive: boolean }>(({ theme, isActive }) => ({
  display: "flex",
  alignItems: "center",
  gap: "20px",
  padding: "18px 36px",
  textDecoration: "none",
  backgroundColor: isActive ? theme.palette.secondary.main : "transparent",
  color: isActive ? theme.palette.primary.main : theme.palette.grey[800],
  fontWeight: isActive ? 700 : 400,
  transition: "all .3s ease",

  "& svg": {
    color: isActive ? theme.palette.primary.main : theme.palette.grey[500],
    fontSize: "1.5rem",
  },

  "&:hover": {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
    fontWeight: 700,
    transition: "all .3s ease",

    "& svg": {
      color: theme.palette.primary.main,
      transition: "all .3s ease",
    },
  },
}));
