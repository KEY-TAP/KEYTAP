"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// mui
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { deleteBrandClient } from "@/lib/api/brandsClient";
import BrandRegisterModal from "./BrandRegisterModal";
import SearchField from "../../_common/_components/SearchField";

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

const TABLE_COLUMNS = "70px 30% minmax(0, 1fr) 70px";

export default function BrandTable({ brands }: Props) {
  const router = useRouter();

  // 점 3개 메뉴 상태
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 브랜드 등록 모달 열림/닫힘 상태
  const [modalOpen, setModalOpen] = useState(false);

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
    <BrandPage>
      <BrandContent>
        {/* 상단: 전체 수 */}
        <TotalCount>
          전체
          <TotalCountValue>{brands.length}</TotalCountValue>
        </TotalCount>

        {/* 검색창 */}
        <SearchArea>
          <SearchField placeholder="상품명 검색" value={keyword} onChange={setKeyword} />
        </SearchArea>

        {/* 브랜드 목록 */}
        <BrandTableArea>
          {/* 테이블 헤더 */}
          <TableHeader>
            <TableHeaderText>No.</TableHeaderText>

            <TableHeaderText>브랜드명</TableHeaderText>

            <TableHeaderText>등록된 제품 수</TableHeaderText>

            <TableMenuHeader />
          </TableHeader>

          {/* 브랜드 목록 */}
          {brands.map((brand, index) => (
            <TableRow key={brand.brand_id}>
              <RowNumber>{index + 1}</RowNumber>

              <BrandName title={brand.brand_name}>{brand.brand_name}</BrandName>

              {/* products 배열 길이 = 해당 브랜드에 등록된 제품 수 */}
              <DataText>{brand.products?.length ?? 0}</DataText>

              <MenuButtonCell>
                <BrandMenuButton size="small" onClick={(e) => handleMenuOpen(e, brand.brand_id)}>
                  <MoreMenuIcon />
                </BrandMenuButton>
              </MenuButtonCell>
            </TableRow>
          ))}
        </BrandTableArea>
      </BrandContent>

      {/* 하단 버튼 영역 */}
      <BottomActions>
        <ExportButton variant="outlined">전체 목록 내보내기</ExportButton>

        <RegisterButton variant="contained" disableElevation onClick={() => setModalOpen(true)}>
          브랜드 등록
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
        <ActionMenuItem onClick={handleDelete}>삭제</ActionMenuItem>
      </ActionMenu>

      {/*
        modalOpen이 true일 때만 모달 렌더링
        onClose: 모달 닫기
        onSuccess: 등록 완료 후 목록 새로고침
      */}
      <BrandRegisterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleRegisterSuccess}
      />
    </BrandPage>
  );
}

const BrandPage = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minHeight: "calc(100vh - 48px)",
  boxSizing: "border-box",
  backgroundColor: theme.palette.background.default,
}));

const BrandContent = styled(Box)({
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

const TotalCountValue = styled("strong")(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
}));

const SearchArea = styled(Box)({
  width: "100%",
  marginTop: "30px",
});

const BrandTableArea = styled(Box)({
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

const BrandName = styled(Typography)(({ theme }) => ({
  overflow: "hidden",
  paddingRight: "16px",
  color: theme.palette.grey[800],
  fontSize: "1rem",
  fontWeight: 400,
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

const BrandMenuButton = styled(IconButton)(({ theme }) => ({
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
