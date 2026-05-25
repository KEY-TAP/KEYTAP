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
import { deleteProductClient } from "@/lib/api/productsClients";
import { TextField } from "@mui/material";

interface Product {
  product_id: number;
  product_name: string;
  product_type: string | null;
  description: string | null;
  created_at: string;
  brands: { brand_name: string }[] | null;
}

interface Props {
  products: Product[];
}

export default function ProductTable({ products }: Props) {
  const router = useRouter();

  // 점 3개 메뉴 열림/닫힘 상태
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, id: number) => {
    console.log("메뉴 열림, id:", id);
    setAnchorEl(e.currentTarget); // 클릭한 버튼 위치에 메뉴 띄우기
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    console.log("handleDelete 호출됨", selectedId);
    if (!selectedId) return;
    await deleteProductClient(selectedId);
    handleMenuClose();
    router.refresh(); // 삭제 후 목록 새로고침
  };

  const handleEdit = () => {
    if (!selectedId) return;
    router.push(`/admin/products/${selectedId}/edit`);
    handleMenuClose();
  };

  const filterProducts = products.filter((products) => {
    if (!keyword) return true;
    return products.product_name.toLowerCase().includes(keyword.toLowerCase());
  });

  return (
    <Box>
      {/* 상단: 전체 수 + 등록 버튼 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="body1" color="text.secondary">
          전체 <strong>{products.length}</strong>
        </Typography>
        <Button variant="contained" onClick={() => router.push("/admin/products/register")}>
          상품 등록
        </Button>
      </Box>

      {/* 검색창 */}
      <TextField fullWidth placeholder="상품명 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} sx={{ mb: 2 }} />

      {/* 테이블 헤더 */}
      <TableHeader>
        <Typography variant="body2" sx={{ width: 40 }}>
          No.
        </Typography>
        <Typography variant="body2" sx={{ flex: 1 }}>
          상품명
        </Typography>
        <Typography variant="body2" sx={{ width: 120 }}>
          브랜드
        </Typography>
        <Typography variant="body2" sx={{ width: 120 }}>
          등록일
        </Typography>
        <Box sx={{ width: 40 }} />
      </TableHeader>

      {/* 상품 목록 */}
      {filterProducts.map((product, index) => (
        <TableRow key={product.product_id}>
          <Typography variant="body2" color="text.secondary" sx={{ width: 40 }}>
            {index + 1}
          </Typography>

          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              {product.product_name}
            </Typography>
            {product.description && (
              <Typography variant="caption" color="text.secondary">
                {product.description}
              </Typography>
            )}
          </Box>

          <Typography variant="body2" sx={{ width: 120 }}>
            {product.brands?.[0]?.brand_name ?? "-"}
          </Typography>

          {/* created_at은 "2026-04-11T..." 형태라 앞 10자리만 자름 */}
          <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
            {product.created_at.slice(0, 10)}
          </Typography>

          <IconButton size="small" sx={{ width: 40 }} onClick={(e) => handleMenuOpen(e, product.product_id)}>
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
