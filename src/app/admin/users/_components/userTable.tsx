"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { deleteUserClient, getCurrentUserRole, updateUserRoleClient } from "@/lib/api/usersClient";
import SearchField from "../../_common/_components/SearchField";

// mui
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

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

const TABLE_COLUMNS = "70px 14% 16% 22% 20% minmax(0, 1fr) 70px";

export default function UserTable({ users }: Props) {
  const router = useRouter();

  // 현재 로그인한 유저의 role
  const [myRole, setMyRole] = useState<"user" | "admin" | "super_admin" | null>(null);

  // 점 3개 메뉴 상태
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 검색어 상태
  const [keyword, setKeyword] = useState("");

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
    if (myRole === "admin" && targetRole === "user") {
      return true;
    }

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

  // 유저명 검색
  const filterUsers = users.filter((user) => {
    if (!keyword) return true;

    return user.name.toLowerCase().includes(keyword.toLowerCase());
  });

  return (
    <UserPage>
      <UserContent>
        {/* 상단: 전체 수 */}
        <TotalCount>
          전체
          <TotalCountValue>{users.length}</TotalCountValue>
        </TotalCount>

        {/* 검색창 */}
        <SearchArea>
          <SearchField placeholder="유저명 검색" value={keyword} onChange={setKeyword} />
        </SearchArea>

        {/* 유저 목록 */}
        <UserTableArea>
          {/* 테이블 헤더 */}
          <TableHeader>
            <TableHeaderText>No.</TableHeaderText>

            <TableHeaderText>아이디</TableHeaderText>

            <TableHeaderText>이름</TableHeaderText>

            <TableHeaderText>연락처</TableHeaderText>

            <TableHeaderText>회원 유형</TableHeaderText>

            <TableHeaderText>가입일</TableHeaderText>

            <TableMenuHeader />
          </TableHeader>

          {/* 유저 목록 */}
          {filterUsers.map((user, index) => (
            <TableRow key={user.user_id}>
              <RowNumber>{index + 1}</RowNumber>

              <DataText title={user.email}>{user.email}</DataText>

              <UserName title={user.name}>{user.name}</UserName>

              <DataText title={user.phone}>{user.phone}</DataText>

              {/*
                회원 유형 셀렉트박스
                클릭하면 바로 role 변경 가능
                admin, super_admin만 변경 가능
              */}
              <RoleCell>
                {myRole === "admin" || myRole === "super_admin" ? (
                  <RoleSelect
                    size="small"
                    value={user.user_role}
                    onChange={(e) => handleRoleChange(user.user_id, e.target.value as string)}
                  >
                    <RoleMenuItem value="user">정회원</RoleMenuItem>

                    <RoleMenuItem value="admin">관리자</RoleMenuItem>

                    <RoleMenuItem value="super_admin">슈퍼관리자</RoleMenuItem>
                  </RoleSelect>
                ) : (
                  <DataText>{roleLabel[user.user_role] ?? user.user_role}</DataText>
                )}
              </RoleCell>

              {/* created_at 앞 10자리만 표시 */}
              <DataText>{user.created_at.slice(0, 10)}</DataText>

              {/* 삭제 권한 있을 때만 점 3개 버튼 표시 */}
              <MenuButtonCell>
                {canDelete(user.user_role) && (
                  <UserMenuButton size="small" onClick={(e) => handleMenuOpen(e, user.user_id)}>
                    <MoreMenuIcon />
                  </UserMenuButton>
                )}
              </MenuButtonCell>
            </TableRow>
          ))}
        </UserTableArea>
      </UserContent>

      {/* 하단 버튼 */}
      <BottomActions>
        <ExportButton variant="outlined">전체 목록 내보내기</ExportButton>
      </BottomActions>

      {/* 삭제 드롭다운 */}
      <ActionMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <ActionMenuItem onClick={handleDelete}>삭제</ActionMenuItem>
      </ActionMenu>
    </UserPage>
  );
}

const UserPage = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minHeight: "calc(100vh - 48px)",
  boxSizing: "border-box",
  backgroundColor: theme.palette.background.default,
}));

const UserContent = styled(Box)({
  width: "100%",
});

const TotalCount = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "5px",
  color: theme.palette.text.primary,
  fontSize: "1.25rem",
  fontWeight: 400,
}));

const TotalCountValue = styled("span")(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
}));

const SearchArea = styled(Box)({
  width: "100%",
  marginTop: "30px",
});

const UserTableArea = styled(Box)({
  width: "100%",
});

const TableHeader = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: TABLE_COLUMNS,
  alignItems: "center",
  width: "100%",
  boxSizing: "border-box",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const TableHeaderText = styled(Typography)(({ theme }) => ({
  overflow: "hidden",
  padding: "20px 16px",
  color: theme.palette.text.secondary,
  fontSize: "1rem",
  fontWeight: 300,
  lineHeight: 1,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const TableMenuHeader = styled(Box)({
  width: "24px",
});

const TableRow = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: TABLE_COLUMNS,
  alignItems: "center",
  width: "100%",
  padding: "20px",
  boxSizing: "border-box",
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: "background-color 0.12s ease",

  "&:hover": {
    backgroundColor: alpha(theme.palette.grey[100], 0.45),
  },
}));

const RowNumber = styled(Typography)(({ theme }) => ({
  paddingLeft: "20px",
  boxSizing: "border-box",
  color: theme.palette.grey[800],
  fontSize: "0.875rem",
  fontWeight: 400,
  lineHeight: 1,
}));

const DataText = styled(Typography)(({ theme }) => ({
  overflow: "hidden",
  paddingRight: "8px",
  color: theme.palette.text.primary,
  fontSize: "1rem",
  fontWeight: 400,
  lineHeight: 1.4,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const UserName = styled(Typography)(({ theme }) => ({
  overflow: "hidden",
  paddingRight: "8px",
  color: theme.palette.text.primary,
  fontSize: "1rem",
  fontWeight: 700,
  lineHeight: 1.4,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const RoleCell = styled(Box)({
  minWidth: 0,
  paddingRight: "8px",
  boxSizing: "border-box",
});

const RoleSelect = styled(Select)(({ theme }) => ({
  width: "100%",
  height: "24px",
  color: theme.palette.text.primary,
  backgroundColor: "transparent",
  fontSize: "1rem",
  fontWeight: 400,

  "& .MuiSelect-select": {
    minHeight: "auto",
    padding: "0 24px 0 0",
    boxSizing: "border-box",
    lineHeight: "24px",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    border: 0,
  },

  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: 0,
  },

  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: 0,
  },

  "& .MuiSelect-icon": {
    right: "4px",
    color: theme.palette.text.secondary,
    fontSize: "1rem",
  },
}));

const RoleMenuItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "1rem",
  fontWeight: 400,
}));

const MenuButtonCell = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "24px",
});

const UserMenuButton = styled(IconButton)(({ theme }) => ({
  width: "28px",
  height: "28px",
  padding: 0,
  borderRadius: "5px",
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.secondary.main,

  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
  },

  "&:focus-visible": {
    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
  },
}));

const MoreMenuIcon = styled(MoreHorizIcon)({
  fontSize: "1rem",
});

const ActionMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    width: "110px",
    marginTop: "4px",
    overflow: "hidden",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "5px",
    backgroundColor: theme.palette.background.default,
    boxShadow: `0 10px 10px ${alpha(theme.palette.common.black, 0.16)}`,
  },

  "& .MuiMenu-list": {
    padding: 0,
  },
}));

const ActionMenuItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  padding: "16px 36px",
  boxSizing: "border-box",
  color: theme.palette.grey[800],
  fontSize: "1.25rem",
  fontWeight: 400,
  lineHeight: 1,

  "&:not(:last-of-type)": {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },

  "&:hover": {
    backgroundColor: alpha(theme.palette.text.primary, 0.1),
  },
}));

const BottomActions = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "22px",
  marginTop: "auto",
  boxSizing: "border-box",
});

const ExportButton = styled(Button)(({ theme }) => ({
  width: "auto",
  height: "56px",
  padding: "16px 20px",
  boxSizing: "border-box",
  borderColor: theme.palette.divider,
  borderRadius: "5px",
  color: theme.palette.grey[800],
  backgroundColor: theme.palette.background.default,
  fontSize: "1.25rem",
  fontWeight: 400,
  textTransform: "none",
  transition: "all .3s ease",

  "&:hover": {
    borderColor: theme.palette.primary.main,
    color: theme.palette.background.default,
    backgroundColor: theme.palette.primary.main,
    transition: "all .3s ease",
  },
}));
