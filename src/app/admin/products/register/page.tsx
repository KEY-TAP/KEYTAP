import { getBrands } from "@/lib/api/products";
import RegisterForm from "@/app/admin/products/_components/RegisterForm";
import Box from "@mui/material/Box";

import Header from "../../_components/Header";

// Server Component: 브랜드 목록 미리 fetch해서 폼에 넘겨줌
export default async function RegisterPage() {
  const brands = await getBrands();

  return (
    <Box>
      {/* 헤더 */}
      <Header title="상품 등록" />

      <RegisterForm brands={brands ?? []} />
    </Box>
  );
}
