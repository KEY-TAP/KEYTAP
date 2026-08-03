"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createProductClient, uploadProductImageClient } from "@/lib/api/productsClients";
import ImageUpload from "@/app/admin/products/_components/ImageUpload";

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

interface Props {
  brands: Brand[];
}

export default function RegisterForm({ brands }: Props) {
  const router = useRouter();

  const [productName, setProductName] = useState("");
  const [exProductName, setExProductName] = useState("");
  const [brandId, setBrandId] = useState<number | "">("");
  const [productType, setProductType] = useState("");
  const [description, setDescription] = useState("");
  const [hashTags, setHashTags] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!productName || !brandId) return;

    setLoading(true);

    try {
      // 1단계: 상품 먼저 등록
      // product_id가 있어야 이미지 업로드 가능
      const product = await createProductClient({
        product_name: productName.trim(),
        fk_brand_id: Number(brandId),
        product_type: productType.trim(),
        description: description.trim(),
        hashtags: hashTags.trim(),
      });

      // 2단계: 이미지 동시 업로드
      // Promise.all = 병렬 처리
      if (files.length > 0) {
        await Promise.all(files.map((file) => uploadProductImageClient(file, product.product_id)));
      }

      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrap>
      <FieldCol>
        <LabelCol>기존 상품 불러오기</LabelCol>
        <FormTextField
          placeholder="상품명으로 검색해주세요."
          value={exProductName}
          onChange={(e) => setExProductName(e.target.value)}
        />
      </FieldCol>

      <Section>
        <ProductInfoTitle variant="h6">상품 정보</ProductInfoTitle>

        <FieldRow>
          <Label>상품코드</Label>

          <FormTextField disabled placeholder="상품 등록 후 자동 생성됩니다" />
        </FieldRow>

        <FieldRow>
          <Label>상품명</Label>

          <FormTextField
            placeholder="상품명을 입력해주세요"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </FieldRow>

        <FieldRow>
          <Label>브랜드</Label>

          <BrandFormControl size="small">
            <InputLabel>브랜드 불러오기</InputLabel>

            <Select
              value={brandId}
              label="브랜드 불러오기"
              onChange={(e) => setBrandId(e.target.value as number)}
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
          <Label>주요 특징</Label>

          <FormTextField
            multiline
            rows={4}
            placeholder="로우&하이 프로파일 교체, 탠커리스, ..."
            size="small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FieldRow>

        <FieldRow>
          <Label>해시태그</Label>

          <FormTextField
            multiline
            rows={4}
            placeholder="콤마(,)로 구분해주세요."
            size="small"
            value={hashTags}
            onChange={(e) => setHashTags(e.target.value)}
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
          {loading ? "등록 중..." : "상품 등록"}
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
  marginBottom: "16px",
  maxWidth: "800px",
});

const FieldCol = styled(Box)({
  display: "flex",
  flexDirection: "column",
  maxWidth: "800px",
  alignItems: "flex-start",
  gap: "24px",
  marginBottom: "64px",
});

const Label = styled(Typography)(({ theme }) => ({
  minWidth: "130px",
  color: theme.palette.text.secondary,
  fontSize: "1rem",
  fontWeight: 400,
}));

const LabelCol = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 400,
  color: theme.palette.grey[700],
}));

const FormTextField = styled(TextField)({
  width: "100%",
  borderRadius: "5px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "5px",
  },
});

const BrandFormControl = styled(FormControl)({
  width: "100%",

  borderRadius: "5px",
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
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,

  "&:hover": {
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.default,
  },
}));
