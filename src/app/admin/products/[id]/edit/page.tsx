import EditForm from "@/app/admin/products/_components/EditForm";
import Header from "../../../_components/Header";
import { getProductById, getBrands, getSwitchesForProduct } from "@/lib/api/products";
import { Box } from "@mui/material";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);

  // 기존 상품 데이터 + 브랜드 목록 + 스위치 목록 동시에 가져오기
  const [product, brands, switches] = await Promise.all([
    getProductById(productId),
    getBrands(),
    getSwitchesForProduct(),
  ]);

  return (
    <Box>
      {/* 헤더 */}
      <Header title="상품 수정" />

      <EditForm product={product} brands={brands ?? []} switches={switches ?? []} />
    </Box>
  );
}
