import { getBrandsWithProductCount } from "@/lib/api/brands";
import BrandTable from "./_components/BrandTable";
import Box from "@mui/material/Box";
import Header from "../_components/Header";

// Server Component: 브랜드 목록 fetch 후 BrandTable에 넘겨줌
export default async function BrandsPage() {
  const brands = await getBrandsWithProductCount();

  return (
    <Box>
      {/* 헤더 */}
      <Header title="브랜드 관리" />

      <BrandTable brands={brands ?? []} />
    </Box>
  );
}
