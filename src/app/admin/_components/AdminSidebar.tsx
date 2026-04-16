"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

// mui-icons
import HomeIcon from "@mui/icons-material/Home";
import AddBoxIcon from "@mui/icons-material/AddBox";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import PeopleIcon from "@mui/icons-material/People";

const menuItems = [
  { label: "홈", href: "/admin", icon: <HomeIcon /> },
  { label: "상품 관리", href: "/admin/products", icon: <AddBoxIcon /> },
  { label: "스위치 등록", href: "/admin/switches", icon: <KeyboardIcon /> },
  { label: "유저 관리", href: "/admin/users", icon: <PeopleIcon /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Aside>
      <LogoWrap>
        <img src="/logo.png" alt="KEYTAP" style={{ width: "100%", height: "auto", maxWidth: "149px" }} />
      </LogoWrap>
      <nav>
        {menuItems.map((item) => (
          <MenuItem key={item.href} component={Link} href={item.href} isActive={pathname === item.href}>
            {item.icon}
            {item.label}
          </MenuItem>
        ))}
      </nav>
    </Aside>
  );
}

// 스타일드 컴포넌트

const Aside = styled("aside")(() => ({
  width: "180px",
  borderRight: "1px solid #eee",
  padding: "24px 0",
}));

const LogoWrap = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  padding: "0 20px 24px",
}));

const MenuItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ component?: React.ElementType; href?: string; isActive: boolean }>(({ theme, isActive }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 20px",
  textDecoration: "none",
  backgroundColor: isActive ? "#f0f4ff" : "transparent",
  color: isActive ? theme.palette.primary.main : "#333",
  fontWeight: isActive ? "bold" : "normal",
  transition: "all .3s ease",

  "&:hover": {
    backgroundColor: "#f0f4ff",
    color: theme.palette.primary.main,
    fontWeight: "bold",
  },
}));
