import { getBrands, getSwitchesForProduct } from "@/lib/api/products";
import RegisterForm from "@/app/admin/products/_components/RegisterForm";

import Box from "@mui/material/Box";

import Header from "../../_components/Header";

// Server Component: 브랜드 목록과 스위치 목록 미리 fetch해서 폼에 넘겨줌
export default async function RegisterPage() {
  const [brands, switches] = await Promise.all([getBrands(), getSwitchesForProduct()]);

  return (
    <Box>
      <Header title="상품 등록" />

      <RegisterForm brands={brands ?? []} switches={switches ?? []} />
    </Box>
  );
}
