import EditForm from "@/app/admin/products/_components/EditForm";
import Header from "../../../_components/Header";
import { getProductById, getBrands } from "@/lib/api/products";
import { Box } from "@mui/material";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);

  // 기존 상품 데이터 + 브랜드 목록 동시에 가져오기
  const [product, brands] = await Promise.all([getProductById(productId), getBrands()]);

  return (
    <Box>
      {/* 헤더 */}
      <Header title="상품 수정" />

      <EditForm product={product} brands={brands ?? []} />
    </Box>
  );
}
