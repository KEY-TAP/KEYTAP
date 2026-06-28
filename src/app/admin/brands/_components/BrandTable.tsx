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
import { deleteBrandClient } from "@/lib/api/brandsClient";
import BrandRegisterModal from "./BrandRegisterModal";

// brands/page.tsx에서 넘겨주는 데이터 타입
// products가 배열인 이유: Supabase JOIN 결과는 항상 배열로 반환됨
interface Brand {
  brand_id: number;
  brand_name: string;
  created_at: string;
  products: { product_id: number }[] | null;
}

interface Props {
  brands: Brand[];
}

export default function BrandTable({ brands }: Props) {
  const router = useRouter();

  // 점 3개 메뉴 상태
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 브랜드 등록 모달 열림/닫힘 상태
  const [modalOpen, setModalOpen] = useState(false);

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
    await deleteBrandClient(selectedId);
    handleMenuClose();
    router.refresh(); // 삭제 후 목록 새로고침
  };

  // 모달에서 등록 완료 후 호출되는 콜백
  const handleRegisterSuccess = () => {
    setModalOpen(false);
    router.refresh(); // 등록 후 목록 새로고침
  };

  return (
    <Box>
      {/* 상단: 전체 수 */}
      <Typography variant="body1" color="text.secondary" mb={2}>
        전체 <strong>{brands.length}</strong>
      </Typography>

      {/* 테이블 헤더 */}
      <TableHeader>
        <Typography variant="body2" sx={{ width: 40 }}>
          No.
        </Typography>
        <Typography variant="body2" sx={{ flex: 1 }}>
          브랜드명
        </Typography>
        <Typography variant="body2" sx={{ width: 160 }}>
          등록된 제품 수
        </Typography>
        <Box sx={{ width: 40 }} />
      </TableHeader>

      {/* 브랜드 목록 */}
      {brands.map((brand, index) => (
        <TableRow key={brand.brand_id}>
          <Typography variant="body2" color="text.secondary" sx={{ width: 40 }}>
            {index + 1}
          </Typography>

          <Typography variant="body2" fontWeight="bold" sx={{ flex: 1 }}>
            {brand.brand_name}
          </Typography>

          {/* products 배열 길이 = 해당 브랜드에 등록된 제품 수 */}
          <Typography variant="body2" sx={{ width: 160 }}>
            {brand.products?.length ?? 0}
          </Typography>

          <IconButton size="small" sx={{ width: 40 }} onClick={(e) => handleMenuOpen(e, brand.brand_id)}>
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </TableRow>
      ))}

      {/* 수정/삭제 드롭다운 */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          삭제
        </MenuItem>
      </Menu>

      {/* 하단 버튼 영역 */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button variant="outlined">전체 목록 내보내기</Button>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          브랜드 등록
        </Button>
      </Box>

      {/*
        modalOpen이 true일 때만 모달 렌더링
        onClose: 모달 닫기
        onSuccess: 등록 완료 후 목록 새로고침
      */}
      <BrandRegisterModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={handleRegisterSuccess} />
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
