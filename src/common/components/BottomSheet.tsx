"use client";

import { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useProductStore } from "@/store/useProductStore";

interface Sound {
  sound_id: number;
  sound_url: string;
  sound_type: string;
}

interface SwitchOption {
  switch_id: number;
  switch_name: string;
  switch_type: string;
  is_default: boolean;
  sounds: Sound[];
}

interface Product {
  product_id: number;
  product_name: string;
  image_url: string | null;
  switches: SwitchOption[];
}

interface Props {
  products: Product[];
}

export default function BottomSheet({ products }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedProduct, setSelectedProduct } = useProductStore();
  const sheetRef = useRef<HTMLDivElement>(null);

  // 드래그로 바텀시트 열고 닫기
  const startY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const diff = e.changedTouches[0].clientY - startY.current;

    // 위로 드래그 → 열기, 아래로 드래그 → 닫기
    if (diff < -50) setIsOpen(true);
    if (diff > 50) setIsOpen(false);
    isDragging.current = false;
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsOpen(false); // 선택 후 바텀시트 닫기
  };

  return (
    <Sheet isOpen={isOpen} ref={sheetRef}>
      {/* 핸들 영역 (드래그 + 버튼) */}
      <Handle onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <HandleBar />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {selectedProduct
              ? selectedProduct.product_name
              : "모델을 선택해주세요"}
          </Typography>
          <IconButton size="small" onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
          </IconButton>
        </Box>
      </Handle>

      {/* 제품 목록 */}
      <ProductList>
        {products.map((product) => (
          <ProductItem
            key={product.product_id}
            isSelected={selectedProduct?.product_id === product.product_id}
            onClick={() => handleSelectProduct(product)}
          >
            {/* 제품 이미지 */}
            <ProductImage
              src={product.image_url ?? "/image/default-image.png"}
              alt={product.product_name}
            />
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                textAlign: "center",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.product_name}
            </Typography>
          </ProductItem>
        ))}
      </ProductList>
    </Sheet>
  );
}

const Sheet = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isOpen",
})<{ isOpen: boolean }>(({ theme, isOpen }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  backgroundColor: theme.palette.background.default,
  borderRadius: "20px 20px 0 0",
  boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
  // 열렸을 때 높이, 닫혔을 때 높이
  height: isOpen ? "60vh" : "80px",
  transition: "height 0.3s ease",
  overflow: "hidden",
}));

const Handle = styled(Box)(() => ({
  padding: "12px 0 8px",
  cursor: "pointer",
}));

const HandleBar = styled(Box)(({ theme }) => ({
  width: "40px",
  height: "4px",
  backgroundColor: theme.palette.grey[300],
  borderRadius: "2px",
  margin: "0 auto 12px",
}));

const ProductList = styled(Box)(() => ({
  display: "flex",
  gap: "16px",
  padding: "16px",
  overflowX: "auto", // 가로 스크롤
  "&::-webkit-scrollbar": { display: "none" }, // 스크롤바 숨김
}));

const ProductItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minWidth: "100px",
  cursor: "pointer",
  padding: "8px",
  borderRadius: "12px",
  border: isSelected
    ? `2px solid ${theme.palette.primary.main}`
    : "2px solid transparent",
  backgroundColor: isSelected
    ? `${theme.palette.primary.main}10`
    : "transparent",
  transition: "all 0.2s ease",
}));

const ProductImage = styled("img")(() => ({
  width: "80px",
  height: "80px",
  objectFit: "cover",
  borderRadius: "8px",
  backgroundColor: "#f0f0f0",
}));
