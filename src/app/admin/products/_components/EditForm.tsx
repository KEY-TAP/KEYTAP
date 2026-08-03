"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { updateProductClient, uploadProductImageClient } from "@/lib/api/productsClients";
import ImageUpload from "./ImageUpload";

// mui
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";

interface Brand {
  brand_id: number;
  brand_name: string;
}

interface ExistingImage {
  image_id: number;
  image_url: string;
  is_primary: boolean;
}

interface Product {
  product_id: number;
  product_name: string;
  product_type: string | null;
  description: string | null;
  hashtags: string;
  fk_brand_id: number;
  product_images: ExistingImage[] | null;
}

interface Props {
  product: Product;
  brands: Brand[];
}

export default function EditForm({ product, brands }: Props) {
  const router = useRouter();

  // 기존 상품 데이터로 초기값 설정
  const [productName, setProductName] = useState(product.product_name);
  const [brandId, setBrandId] = useState<number | "">(product.fk_brand_id);
  const [productType, setProductType] = useState(product.product_type ?? "");
  const [description, setDescription] = useState(product.description ?? "");
  const [hashtags, setHashtags] = useState(product.hashtags ?? "");

  // 수정 페이지에서 새로 추가할 이미지
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!productName.trim() || !brandId) {
      return;
    }

    setLoading(true);

    try {
      // 1단계: 상품 정보 수정
      await updateProductClient(product.product_id, {
        product_name: productName.trim(),
        fk_brand_id: Number(brandId),
        product_type: productType.trim(),
        description: description.trim(),
        hashtags: hashtags.trim(),
      });

      // 2단계: 새로 추가된 이미지 동시 업로드
      if (files.length > 0) {
        await Promise.all(files.map((file) => uploadProductImageClient(file, product.product_id)));
      }

      router.push("/admin/products");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrap>
      <Section>
        <ProductInfoTitle variant="h6">상품 정보</ProductInfoTitle>

        <FieldRow>
          <Label>상품코드</Label>

          <FormTextField disabled value={product.product_id} />
        </FieldRow>

        <FieldRow>
          <Label>상품명</Label>

          <FormTextField
            placeholder="상품명을 입력해주세요"
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
          />
        </FieldRow>

        <FieldRow>
          <Label>브랜드</Label>

          <BrandFormControl size="small">
            <InputLabel>브랜드 불러오기</InputLabel>

            <Select
              value={brandId}
              label="브랜드 불러오기"
              onChange={(event) => {
                setBrandId(Number(event.target.value));
              }}
            >
              {brands.map((brand) => (
                <MenuItem key={brand.brand_id} value={brand.brand_id}>
                  {brand.brand_name}
                </MenuItem>
              ))}
            </Select>
          </BrandFormControl>
        </FieldRow>

        <FieldRow>
          <Label>상품 유형</Label>

          <FormTextField
            placeholder="상품 유형을 입력해주세요"
            value={productType}
            onChange={(event) => setProductType(event.target.value)}
          />
        </FieldRow>

        <FieldRow>
          <Label>주요 특징</Label>

          <FormTextField
            multiline
            rows={4}
            size="small"
            placeholder="로우&하이 프로파일 교체, 텐키리스, ..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </FieldRow>

        <FieldRow>
          <Label>해시태그</Label>

          <FormTextField
            multiline
            rows={4}
            size="small"
            placeholder="콤마(,)로 구분해주세요."
            value={hashtags}
            onChange={(event) => setHashtags(event.target.value)}
          />
        </FieldRow>
      </Section>

      <Section>
        <ProductImageTitle variant="h6">상품 이미지</ProductImageTitle>

        <ImageUpload files={files} onChange={setFiles} />
      </Section>

      <BottomActions>
        <SecondaryActionButton
          type="button"
          variant="outlined"
          onClick={() => router.push("/admin/products")}
        >
          취소
        </SecondaryActionButton>

        <SecondaryActionButton type="button" variant="outlined">
          임시저장
        </SecondaryActionButton>

        <PrimaryActionButton
          type="button"
          variant="contained"
          disableElevation
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "수정 중..." : "수정 완료"}
        </PrimaryActionButton>
      </BottomActions>
    </FormWrap>
  );
}

const FormWrap = styled(Box)({});

const Section = styled(Box)({
  marginBottom: "60px",
});

const ProductInfoTitle = styled(Typography)(({ theme }) => ({
  marginTop: "48px",
  marginBottom: "24px",
  fontSize: "1.25rem",
  fontWeight: 400,
  color: theme.palette.grey[800],
}));

const ProductImageTitle = styled(Typography)(({ theme }) => ({
  marginBottom: "8px",
  fontSize: "1.25rem",
  fontWeight: 400,
  color: theme.palette.grey[800],
}));

const FieldRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  maxWidth: "800px",
  marginBottom: "16px",
});

const Label = styled(Typography)(({ theme }) => ({
  minWidth: "130px",
  color: theme.palette.text.secondary,
  fontSize: "1rem",
  fontWeight: 400,
}));

const FormTextField = styled(TextField)({
  width: "100%",

  "& .MuiOutlinedInput-root": {
    borderRadius: "5px",
  },
});

const BrandFormControl = styled(FormControl)({
  width: "100%",

  "& .MuiOutlinedInput-root": {
    borderRadius: "5px",
  },
});

const BottomActions = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  gap: "10px",
  marginTop: "80px",
  boxSizing: "border-box",
});

const ActionButton = styled(Button)({
  width: "200px",
  height: "56px",
  padding: "16px 20px",
  boxSizing: "border-box",
  borderRadius: "5px",
  fontSize: "1.25rem",
  fontWeight: 400,
  textTransform: "none",
  transition: "all .3s ease",
});

const SecondaryActionButton = styled(ActionButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.grey[800],
  backgroundColor: theme.palette.background.default,

  "&:hover": {
    borderColor: theme.palette.primary.main,
    color: theme.palette.background.default,
    backgroundColor: theme.palette.primary.main,
  },
}));

const PrimaryActionButton = styled(ActionButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,

  "&:hover": {
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.default,
  },

  "&.Mui-disabled": {
    borderColor: theme.palette.grey[300],
    color: theme.palette.common.white,
    backgroundColor: theme.palette.grey[300],
  },
}));
