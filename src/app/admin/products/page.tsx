import { getProducts } from "@/lib/api/products";
import ProductTable from "@/app/admin/products/_components/ProductTable";
import Box from "@mui/material/Box";
import Header from "../_components/Header";

// Server Component: 데이터 fetch 후 ProductTable에 넘겨줌
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <Box>
      {/* 헤더 */}
      <Header title="상품 관리" />

      <ProductTable products={products ?? []} />
    </Box>
  );
}
