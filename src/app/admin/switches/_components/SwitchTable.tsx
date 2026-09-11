"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteSwitchClient } from "@/lib/api/switchesClient";
import SearchField from "../../_common/_components/SearchField";

// mui
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

interface Sound {
  sound_id: number;
  sound_url: string;
  sound_type: string;
}

interface Switch {
  switch_id: number;
  switch_name: string;
  switch_type: string;
  manufacture: string | null;
  created_at: string;
  sounds: Sound[] | null;
}

interface Props {
  switches: Switch[];
}

const TABLE_COLUMNS = "70px 16% 18% 16% minmax(0, 1fr) 70px";

export default function SwitchTable({ switches }: Props) {
  const router = useRouter();

  // 점 3개 메뉴 상태
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 검색어 상태
  const [keyword, setKeyword] = useState("");

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, id: number) => {
    setAnchorEl(e.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    await deleteSwitchClient(selectedId);

    handleMenuClose();
    router.refresh();
  };

  const handleEdit = () => {
    if (!selectedId) return;

    router.push(`/admin/switches/${selectedId}/edit`);
    handleMenuClose();
  };

  // 스위치명 검색
  const filterSwitches = switches.filter((sw) => {
    if (!keyword) return true;

    return sw.switch_name.toLowerCase().includes(keyword.toLowerCase());
  });

  return (
    <SwitchPage>
      <SwitchContent>
        {/* 상단: 전체 수 */}
        <TotalCount>
          전체
          <TotalCountValue>{switches.length}</TotalCountValue>
        </TotalCount>

        {/* 검색창 */}
        <SearchArea>
          <SearchField placeholder="스위치명 검색" value={keyword} onChange={setKeyword} />
        </SearchArea>

        {/* 스위치 목록 */}
        <SwitchTableArea>
          {/* 테이블 헤더 */}
          <TableHeader>
            <TableHeaderText>No.</TableHeaderText>

            <TableHeaderText>스위치명</TableHeaderText>

            <TableHeaderText>스위치 타입</TableHeaderText>

            <TableHeaderText>제조사</TableHeaderText>

            <TableHeaderText>사운드</TableHeaderText>

            <TableMenuHeader />
          </TableHeader>

          {/* 스위치 목록 */}
          {filterSwitches.map((sw, index) => (
            <TableRow key={sw.switch_id}>
              <RowNumber>{index + 1}</RowNumber>

              <SwitchName>{sw.switch_name}</SwitchName>

              <DataText>{sw.switch_type}</DataText>

              <DataText>{sw.manufacture ?? "-"}</DataText>

              {/* 사운드 파일명만 표시 */}
              <DataText>{sw.sounds?.[0] ? sw.sounds[0].sound_url.split("/").pop() : "-"}</DataText>

              <MenuButtonCell>
                <SwitchMenuButton size="small" onClick={(e) => handleMenuOpen(e, sw.switch_id)}>
                  <MoreMenuIcon />
                </SwitchMenuButton>
              </MenuButtonCell>
            </TableRow>
          ))}
        </SwitchTableArea>
      </SwitchContent>

      {/* 하단 버튼 */}
      <BottomActions>
        <ExportButton variant="outlined">전체 목록 내보내기</ExportButton>

        <RegisterButton
          variant="contained"
          disableElevation
          onClick={() => router.push("/admin/switches/register")}
        >
          스위치 등록
        </RegisterButton>
      </BottomActions>

      {/* 수정/삭제 드롭다운 */}
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
        <ActionMenuItem onClick={handleEdit}>수정</ActionMenuItem>

        <ActionMenuItem onClick={handleDelete}>삭제</ActionMenuItem>
      </ActionMenu>
    </SwitchPage>
  );
}

const SwitchPage = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minHeight: "calc(100vh - 48px)",
  boxSizing: "border-box",
  backgroundColor: theme.palette.background.default,
}));

const SwitchContent = styled(Box)({
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

const SwitchTableArea = styled(Box)({
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
  fontSize: "1rem",
  fontWeight: 400,
  lineHeight: 1,
}));

const SwitchName = styled(Typography)(({ theme }) => ({
  overflow: "hidden",
  paddingRight: "16px",
  color: theme.palette.grey[800],
  fontSize: "1rem",
  fontWeight: 700,
  lineHeight: 1.4,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
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

const MenuButtonCell = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "24px",
});

const SwitchMenuButton = styled(IconButton)(({ theme }) => ({
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

const RegisterButton = styled(Button)(({ theme }) => ({
  width: "200px",
  height: "56px",
  padding: "16px 20px",
  boxSizing: "border-box",
  borderRadius: "5px",
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  fontSize: "1.25rem",
  fontWeight: 400,
  textTransform: "none",
  transition: "all .3s ease",

  "&:hover": {
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.default,
    transition: "all .3s ease",
  },
}));
