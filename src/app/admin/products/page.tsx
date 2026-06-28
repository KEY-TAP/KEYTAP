import { getProducts } from "@/lib/api/products";
import ProductTable from "@/app/admin/products/_components/ProductTable";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Server Component: 데이터 fetch 후 ProductTable에 넘겨줌
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        상품 관리
      </Typography>
      <ProductTable products={products ?? []} />
    </Box>
  );
}
