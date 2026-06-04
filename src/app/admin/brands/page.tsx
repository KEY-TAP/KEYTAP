import { getBrandsWithProductCount } from "@/lib/api/brands";
import BrandTable from "./_components/BrandTable";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Server Component: 브랜드 목록 fetch 후 BrandTable에 넘겨줌
export default async function BrandsPage() {
  const brands = await getBrandsWithProductCount();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        브랜드 관리
      </Typography>
      <BrandTable brands={brands ?? []} />
    </Box>
  );
}
