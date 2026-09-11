"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteProductClient } from "@/lib/api/productsClients";
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

interface ProductImage {
  image_url: string;
  is_primary: boolean;
}

interface Product {
  product_id: number;
  product_name: string;
  product_type: string | null;
  description: string | null;
  created_at: string;
  brands: { brand_name: string }[] | null;
  product_images: ProductImage[] | null;
}

interface Props {
  products: Product[];
}

const TABLE_COLUMNS = "70px minmax(0, 1fr) 200px 200px 70px";

const getThumbnailUrl = (images: Product["product_images"]) => {
  if (!images || images.length === 0) return null;
  return images.find((img) => img.is_primary)?.image_url ?? images[0].image_url;
};

export default function ProductTable({ products }: Props) {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

    await deleteProductClient(selectedId);

    handleMenuClose();
    router.refresh();
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
    <ProductPage>
      <ProductContent>
        <TotalCount>
          전체
          <TotalCountValue>{products.length}</TotalCountValue>
        </TotalCount>

        <SearchArea>
          <SearchField placeholder="상품명 검색" value={keyword} onChange={setKeyword} />
        </SearchArea>

        <ProductTableArea>
          <TableHeader>
            <TableHeaderText>No.</TableHeaderText>
            <TableHeaderText>상품명</TableHeaderText>
            <TableHeaderText>브랜드</TableHeaderText>
            <TableHeaderText>등록일</TableHeaderText>
            <TableMenuHeader />
          </TableHeader>

          {filterProducts.map((product, index) => (
            <TableRow key={product.product_id}>
              <RowNumber>{index + 1}</RowNumber>

              <ProductCell>
                <ProductThumbnail aria-hidden="true">{getThumbnailUrl(product.product_images) && <ProductThumbnailImage src={getThumbnailUrl(product.product_images)!} alt="" />}</ProductThumbnail>

                <ProductTextArea>
                  <ProductName title={product.product_name}>{product.product_name}</ProductName>

                  {product.description && <ProductDescription title={product.description}>{product.description}</ProductDescription>}
                </ProductTextArea>
              </ProductCell>

              <DataText title={product.brands?.[0]?.brand_name}>{product.brands?.[0]?.brand_name ?? "-"}</DataText>

              <DataText>{product.created_at.slice(0, 10)}</DataText>

              <MenuButtonCell>
                <ProductMenuButton aria-label={`${product.product_name} 관리 메뉴`} aria-haspopup="menu" aria-controls={selectedId === product.product_id && Boolean(anchorEl) ? "product-action-menu" : undefined} aria-expanded={selectedId === product.product_id && Boolean(anchorEl) ? true : undefined} onClick={(e) => handleMenuOpen(e, product.product_id)}>
                  <MoreMenuIcon />
                </ProductMenuButton>
              </MenuButtonCell>
            </TableRow>
          ))}
        </ProductTableArea>
      </ProductContent>

      <BottomActions>
        <ExportButton type="button" variant="outlined">
          전체 목록 내보내기
        </ExportButton>

        <RegisterButton type="button" variant="contained" disableElevation onClick={() => router.push("/admin/products/register")}>
          상품 등록
        </RegisterButton>
      </BottomActions>

      <ActionMenu id="product-action-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}>
        <ActionMenuItem onClick={handleEdit}>수정</ActionMenuItem>
        <ActionMenuItem onClick={handleDelete}>삭제</ActionMenuItem>
      </ActionMenu>
    </ProductPage>
  );
}

const ProductPage = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minHeight: "calc(100vh - 3rem)",
  boxSizing: "border-box",
  backgroundColor: theme.palette.background.default,
}));

const ProductContent = styled(Box)({ width: "100%" });

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

const SearchArea = styled(Box)({ width: "100%", marginTop: "30px" });

const ProductTableArea = styled(Box)({ width: "100%" });

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
  color: theme.palette.text.secondary,
  fontSize: "16px",
  fontWeight: 300,
  lineHeight: 1,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  padding: "20px 16px",
}));

const TableMenuHeader = styled(Box)({ width: "1.5rem" });

const TableRow = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: TABLE_COLUMNS,
  alignItems: "center",
  width: "100%",
  padding: "20px",
  boxSizing: "border-box",
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: "background-color 0.12s ease",
  "&:hover": { backgroundColor: alpha(theme.palette.grey[100], 0.45) },
}));

const RowNumber = styled(Typography)(({ theme }) => ({
  paddingLeft: "20px",
  boxSizing: "border-box",
  color: theme.palette.grey[800],
  fontSize: "1rem",
  fontWeight: 400,
  lineHeight: 1,
}));

const ProductCell = styled(Box)({
  display: "flex",
  alignItems: "center",
  minWidth: 0,
  paddingRight: "16px",
  gap: "10px",
});

const ProductThumbnail = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  width: "80px",
  height: "80px",
  overflow: "hidden",
  backgroundColor: theme.palette.grey[200],
}));

const ProductThumbnailImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const ProductTextArea = styled(Box)({ flex: 1 });

const ProductName = styled(Typography)(({ theme }) => ({
  display: "-webkit-box",
  overflow: "hidden",
  color: theme.palette.grey[800],
  fontSize: "1.25rem",
  fontWeight: 400,
  textOverflow: "ellipsis",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
}));

const ProductDescription = styled(Typography)(({ theme }) => ({
  marginTop: "10px",
  overflow: "hidden",
  color: theme.palette.grey[600],
  fontSize: "1rem",
  fontWeight: 400,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const DataText = styled(Typography)(({ theme }) => ({
  overflow: "hidden",
  paddingRight: "0.5rem",
  color: theme.palette.text.primary,
  fontSize: "1rem",
  fontWeight: 400,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const MenuButtonCell = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1.5rem",
});

const ProductMenuButton = styled(IconButton)(({ theme }) => ({
  width: "28px",
  height: "28px",
  padding: 0,
  borderRadius: "5px",
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.secondary.main,
  "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.12) },
  "&:focus-visible": { boxShadow: `0 0 0 1px ${theme.palette.primary.main}` },
}));

const MoreMenuIcon = styled(MoreHorizIcon)({ fontSize: "1rem" });

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
  "& .MuiMenu-list": { padding: 0 },
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
  "&:not(:last-of-type)": { borderBottom: `1px solid ${theme.palette.divider}` },
  "&:hover": { backgroundColor: alpha(theme.palette.text.primary, 0.1) },
}));

const BottomActions = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "22px",
  marginTop: "auto",
  boxSizing: "border-box",
});

export const ExportButton = styled(Button)(({ theme }) => ({
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
    background: theme.palette.primary.main,
    color: theme.palette.background.default,
    borderColor: theme.palette.primary.main,
    transition: "all .3s ease",
  },
}));

export const RegisterButton = styled(Button)(({ theme }) => ({
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
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    transition: "all .3s ease",
  },
}));
