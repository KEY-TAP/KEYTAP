"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { getCurrentUserRole, updateUserRoleClient, deleteUserClient } from "@/lib/api/usersClient";

interface User {
  user_id: string;
  email: string;
  name: string;
  phone: string;
  user_role: string;
  created_at: string;
}

interface Props {
  users: User[];
}

// role 한글 표시
const roleLabel: Record<string, string> = {
  user: "정회원",
  admin: "관리자",
  super_admin: "슈퍼관리자",
};

export default function UserTable({ users }: Props) {
  const router = useRouter();

  // 현재 로그인한 유저의 role
  const [myRole, setMyRole] = useState<"user" | "admin" | "super_admin" | null>(null);

  // 점 3개 메뉴 상태
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 현재 로그인한 유저 role 가져오기
  useEffect(() => {
    getCurrentUserRole().then(setMyRole);
  }, []);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(e.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  // 삭제 권한 체크
  // admin → user만 삭제 가능
  // super_admin → admin, user 모두 삭제 가능
  const canDelete = (targetRole: string) => {
    if (myRole === "super_admin") return true;
    if (myRole === "admin" && targetRole === "user") return true;
    return false;
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    await deleteUserClient(selectedId);
    handleMenuClose();
    router.refresh();
  };

  // role 변경 (셀렉트박스 클릭 시)
  const handleRoleChange = async (userId: string, newRole: string) => {
    await updateUserRoleClient(userId, newRole);
    router.refresh();
  };

  return (
    <Box>
      {/* 상단: 전체 수 */}
      <Typography variant="body1" color="text.secondary" mb={2}>
        전체 <strong>{users.length}</strong>
      </Typography>

      {/* 테이블 헤더 */}
      <TableHeader>
        <Typography variant="body2" sx={{ width: 40 }}>
          No.
        </Typography>
        <Typography variant="body2" sx={{ width: 200 }}>
          아이디
        </Typography>
        <Typography variant="body2" sx={{ width: 120 }}>
          이름
        </Typography>
        <Typography variant="body2" sx={{ width: 160 }}>
          연락처
        </Typography>
        <Typography variant="body2" sx={{ width: 160 }}>
          회원 유형
        </Typography>
        <Typography variant="body2" sx={{ width: 120 }}>
          가입일
        </Typography>
        <Box sx={{ width: 40 }} />
      </TableHeader>

      {/* 유저 목록 */}
      {users.map((user, index) => (
        <TableRow key={user.user_id}>
          <Typography variant="body2" color="text.secondary" sx={{ width: 40 }}>
            {index + 1}
          </Typography>

          <Typography variant="body2" sx={{ width: 200 }}>
            {user.email}
          </Typography>

          <Typography variant="body2" sx={{ width: 120 }}>
            {user.name}
          </Typography>

          <Typography variant="body2" sx={{ width: 160 }}>
            {user.phone}
          </Typography>

          {/*
            회원 유형 셀렉트박스
            클릭하면 바로 role 변경 가능
            admin, super_admin만 변경 가능
          */}
          <Box sx={{ width: 160 }}>
            {myRole === "admin" || myRole === "super_admin" ? (
              <Select size="small" value={user.user_role} onChange={(e) => handleRoleChange(user.user_id, e.target.value)} sx={{ fontSize: "0.875rem" }}>
                <MenuItem value="user">정회원</MenuItem>
                <MenuItem value="admin">관리자</MenuItem>
                <MenuItem value="super_admin">슈퍼관리자</MenuItem>
              </Select>
            ) : (
              <Typography variant="body2">{roleLabel[user.user_role] ?? user.user_role}</Typography>
            )}
          </Box>

          {/* created_at 앞 10자리만 표시 */}
          <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
            {user.created_at.slice(0, 10)}
          </Typography>

          {/* 삭제 권한 있을 때만 점 3개 버튼 표시 */}
          {canDelete(user.user_role) ? (
            <IconButton size="small" sx={{ width: 40 }} onClick={(e) => handleMenuOpen(e, user.user_id)}>
              <MoreHorizIcon fontSize="small" />
            </IconButton>
          ) : (
            <Box sx={{ width: 40 }} />
          )}
        </TableRow>
      ))}

      {/* 삭제 드롭다운 */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          삭제
        </MenuItem>
      </Menu>

      {/* 하단 버튼 */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Button variant="outlined">전체 목록 내보내기</Button>
      </Box>
    </Box>
  );
}

const TableHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "12px 16px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
}));

const TableRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "16px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
  },
}));
