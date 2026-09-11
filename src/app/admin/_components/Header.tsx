"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// mui-icons
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { useAdminAuth } from "./AdminAuthContext";
import { supabase } from "@/lib/supabaseClient";

type HeaderProps = {
  title?: ReactNode;
  children?: ReactNode;
  adminName?: string;
  onLogout?: () => void;
};

export default function Header({ title, children, adminName, onLogout }: HeaderProps) {
  const router = useRouter();
  const { adminName: contextAdminName } = useAdminAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const isProfileMenuOpen = Boolean(anchorEl);
  const headerTitle = title ?? children;

  // adminName을 직접 넘기면 그 값을 우선 사용하고, 없으면 admin/layout.tsx에서 조회해 내려준 실제 관리자 이름을 사용
  const resolvedAdminName = adminName ?? contextAdminName;
  const adminInitial = resolvedAdminName?.trim() ? Array.from(resolvedAdminName.trim())[0] : "관";

  const handleProfileMenuToggle = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();

    if (onLogout) {
      onLogout();
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("로그아웃 중 오류가 발생했습니다.");
      return;
    }

    router.push("/LoginPage");
  };

  return (
    <HeaderWrapper>
      <Title variant="h5" fontWeight="bold">
        {headerTitle}
      </Title>

      <RightArea>
        <NotificationButton type="button" aria-label="알림">
          <NotificationsNoneOutlinedIcon />
        </NotificationButton>

        <ProfileTrigger
          type="button"
          id="admin-profile-button"
          aria-label="관리자 메뉴"
          aria-controls={isProfileMenuOpen ? "admin-profile-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={isProfileMenuOpen ? "true" : undefined}
          isOpen={isProfileMenuOpen}
          onClick={handleProfileMenuToggle}
        >
          <AdminAvatar>{adminInitial}</AdminAvatar>

          {isProfileMenuOpen ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
        </ProfileTrigger>

        <ProfileMenu
          id="admin-profile-menu"
          anchorEl={anchorEl}
          open={isProfileMenuOpen}
          onClose={handleProfileMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <LogoutItem onClick={handleLogout}>
            <LogoutOutlinedIcon />
            로그아웃
          </LogoutItem>
        </ProfileMenu>
      </RightArea>
    </HeaderWrapper>
  );
}

// 스타일드 컴포넌트

const HeaderWrapper = styled("header")(() => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 0 40px 0",
  boxSizing: "border-box",
}));

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[800],
}));

const RightArea = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "32px",
}));

const NotificationButton = styled(IconButton)(({ theme }) => ({
  width: "36px",
  height: "36px",
  padding: 0,
  color: theme.palette.grey[800],
  transition: "all .3s ease",

  "& svg": {
    fontSize: "1.75rem",
  },

  "&:hover": {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
  },

  "&:focus-visible": {
    outline: `2px solid ${alpha(theme.palette.primary.main, 0.35)}`,
    outlineOffset: "2px",
  },
}));

const ProfileTrigger = styled("button", {
  shouldForwardProp: (prop) => prop !== "isOpen",
})<{ isOpen: boolean }>(({ theme, isOpen }) => ({
  height: "40px",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "4px 8px 4px 4px",
  border: 0,
  borderRadius: "999px",
  boxSizing: "border-box",
  cursor: "pointer",
  color: theme.palette.text.primary,
  backgroundColor: isOpen ? theme.palette.secondary.main : "transparent",
  transition: "all .3s ease",

  "& svg": {
    fontSize: "1.25rem",
    color: "inherit",
  },

  "&:hover": {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
  },

  "&:focus-visible": {
    outline: `2px solid ${alpha(theme.palette.primary.main, 0.35)}`,
    outlineOffset: "2px",
  },
}));

const AdminAvatar = styled(Box)(({ theme }) => ({
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.grey[50],
  fontSize: "1rem",
  fontWeight: 700,
  lineHeight: 1,
}));

const ProfileMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    minWidth: "132px",
    marginTop: "8px",
    borderRadius: "12px",
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.shadows[3],
  },

  "& .MuiList-root": {
    padding: "6px",
  },
}));

const LogoutItem = styled(MenuItem)(({ theme }) => ({
  minHeight: "38px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 10px",
  borderRadius: "8px",
  color: theme.palette.text.primary,
  fontSize: "0.9375rem",
  fontWeight: 500,

  "& svg": {
    fontSize: "1.125rem",
  },

  "&:hover": {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
  },
}));
