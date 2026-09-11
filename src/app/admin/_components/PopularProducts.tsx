"use client";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface Product {
  name: string;
  brand: string;
  count: number;
}

interface Props {
  products: Product[];
}

export default function PopularProducts({ products }: Props) {
  return (
    <Box sx={{ p: 0, m: 0 }}>
      {products.map((p, i) => (
        <ListItem key={i}>
          <Typography variant="body2" color="text.disabled" sx={{ minWidth: 16 }}>
            {i + 1}
          </Typography>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {p.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {p.brand} · 좋아요 {p.count}개
            </Typography>
          </Box>
        </ListItem>
      ))}
    </Box>
  );
}

const ListItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "10px 0",
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));
