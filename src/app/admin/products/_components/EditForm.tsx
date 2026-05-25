"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import { updateProductClient, uploadProductImageClient } from "@/lib/api/productsClients";
import ImageUpload from "./ImageUpload";

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
  fk_brand_id: number;
  product_images: ExistingImage[] | null;
}

interface Props {
  product: Product;
  brands: Brand[];
}

export default function EditForm({ product, brands }: Props) {
  const router = useRouter();

  // 기존 데이터로 초기값 설정
  const [productName, setProductName] = useState(product.product_name);
  const [brandId, setBrandId] = useState<number | "">(product.fk_brand_id);
  const [productType, setProductType] = useState(product.product_type ?? "");
  const [description, setDescription] = useState(product.description ?? "");
  const [files, setFiles] = useState<File[]>([]); // 새로 추가할 이미지
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!productName || !brandId) return;

    setLoading(true);
    try {
      // 1. 상품 정보 수정
      await updateProductClient(product.product_id, {
        product_name: productName,
        fk_brand_id: Number(brandId),
        product_type: productType,
        description,
      });

      // 2. 새로 추가된 이미지 업로드 (있을 경우)

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
      <Section>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          상품 정보
        </Typography>
        <FieldRow>
          <Label>상품코드</Label>
          <TextField fullWidth disabled value={product.product_id} size="small" />
        </FieldRow>

        <FieldRow>
          <Label>상품명</Label>
          <TextField fullWidth size="small" value={productName} onChange={(e) => setProductName(e.target.value)} />
        </FieldRow>

        <FieldRow>
          <Label>브랜드</Label>
          <FormControl fullWidth size="small">
            <InputLabel>브랜드 불러오기</InputLabel>
            <Select value={brandId} label="브랜드 불러오기" onChange={(e) => setBrandId(e.target.value as number)}>
              {brands.map((brand) => (
                <MenuItem key={brand.brand_id} value={brand.brand_id}>
                  {brand.brand_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FieldRow>

        <FieldRow>
          <Label>주요 특징</Label>
          <TextField fullWidth multiline rows={4} size="small" value={description} onChange={(e) => setDescription(e.target.value)} />
        </FieldRow>
      </Section>
      <Section>
        <Typography>상품 이미지</Typography>
        <ImageUpload files={files} onChange={setFiles} />
      </Section>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button variant="outlined" onClick={() => router.push("/admin/products")}>
          취소
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "수정 중..." : "수정 완료"}
        </Button>
      </Box>
    </FormWrap>
  );
}

const FormWrap = styled(Box)(() => ({
  maxWidth: 720,
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: "32px",
  padding: "24px",
  backgroundColor: theme.palette.background.default,
  borderRadius: "12px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
}));

const FieldRow = styled(Box)(() => ({
  display: "flex",
  alignItems: "flex-start",
  gap: "16px",
  marginBottom: "16px",
}));

const Label = styled(Typography)(({ theme }) => ({
  minWidth: "80px",
  paddingTop: "8px",
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
}));
