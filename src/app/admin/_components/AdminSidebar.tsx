"use client";

import Box from "@mui/material/Box";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AddToQueueOutlined, HomeOutlined, KeyboardAltOutlined, PeopleAltOutlined } from "@mui/icons-material";

const menuItems = [
  { label: "홈", href: "/admin", icon: <HomeOutlined /> },
  { label: "상품 등록", href: "/admin/products", icon: <AddToQueueOutlined /> },
  { label: "스위치 등록", href: "/admin/switches", icon: <KeyboardAltOutlined /> },
  { label: "유저 관리", href: "/admin/users", icon: <PeopleAltOutlined /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{ width: "180px", borderRight: "1px solid #eee", padding: "24px 0" }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "0 20px 24px" }}>
        <img src="/logo.png" alt="KEYTAP" style={{ width: "100%", height: "auto", maxWidth: "149px" }} />
      </div>
      <nav>
        {menuItems.map((item) => (
          <Box
            key={item.href}
            component={Link}
            href={item.href}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "22px",
              padding: "12px 20px",
              textDecoration: "none",
              backgroundColor: pathname === item.href ? "#f0f4ff" : "transparent",
              color: pathname === item.href ? "#1a3faa" : "#333",
              fontWeight: pathname === item.href ? "bold" : "normal",
              "&:hover": {
                backgroundColor: "#f0f4ff",
                color: "#1a3faa",
              },
            }}
          >
            {item.icon}
            {item.label}
          </Box>
        ))}
      </nav>
    </aside>
  );
}
