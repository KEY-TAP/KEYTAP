"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { deleteSwitchClient } from "@/lib/api/switchesClient";

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

export default function SwitchTable({ switches }: Props) {
  const router = useRouter();

  // 점 3개 메뉴 상태
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  return (
    <Box>
      {/* 상단: 전체 수 */}
      <Typography variant="body1" color="text.secondary" mb={2}>
        전체 <strong>{switches.length}</strong>
      </Typography>

      {/* 테이블 헤더 */}
      <TableHeader>
        <Typography variant="body2" sx={{ width: 40 }}>
          No.
        </Typography>
        <Typography variant="body2" sx={{ flex: 1 }}>
          스위치명
        </Typography>
        <Typography variant="body2" sx={{ width: 160 }}>
          스위치 타입
        </Typography>
        <Typography variant="body2" sx={{ width: 160 }}>
          제조사
        </Typography>
        <Typography variant="body2" sx={{ width: 160 }}>
          사운드
        </Typography>
        <Box sx={{ width: 40 }} />
      </TableHeader>

      {/* 스위치 목록 */}
      {switches.map((sw, index) => (
        <TableRow key={sw.switch_id}>
          <Typography variant="body2" color="text.secondary" sx={{ width: 40 }}>
            {index + 1}
          </Typography>

          <Typography variant="body2" fontWeight="bold" sx={{ flex: 1 }}>
            {sw.switch_name}
          </Typography>

          <Typography variant="body2" sx={{ width: 160 }}>
            {sw.switch_type}
          </Typography>

          <Typography variant="body2" sx={{ width: 160 }}>
            {sw.manufacture ?? "-"}
          </Typography>

          {/* 사운드 파일명만 표시 (URL에서 파일명 추출) */}
          <Typography variant="body2" sx={{ width: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {sw.sounds?.[0] ? sw.sounds[0].sound_url.split("/").pop() : "-"}
          </Typography>

          <IconButton size="small" sx={{ width: 40 }} onClick={(e) => handleMenuOpen(e, sw.switch_id)}>
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </TableRow>
      ))}

      {/* 수정/삭제 드롭다운 */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>수정</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          삭제
        </MenuItem>
      </Menu>

      {/* 하단 버튼 */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button variant="outlined">전체 목록 내보내기</Button>
        <Button variant="contained" onClick={() => router.push("/admin/switches/register")}>
          스위치 등록
        </Button>
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
