import { getBrands, getSwitchesForProduct } from "@/lib/api/products";
import RegisterForm from "@/app/admin/products/_components/RegisterForm";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Server Component: 브랜드 목록 미리 fetch해서 폼에 넘겨줌
export default async function RegisterPage() {
  const [brands, switches] = await Promise.all;
  getBrands(), getSwitchesForProduct();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        상품 등록
      </Typography>
      <RegisterForm brands={brands ?? []} switches={switches ?? []} />
    </Box>
  );
}
