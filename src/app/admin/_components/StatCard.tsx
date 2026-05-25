"use client";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface StatCardProps {
  label: string;
  value: number;
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <Card>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4" fontWeight="bold" mt={1}>
        {value.toLocaleString()}
      </Typography>
    </Card>
  );
}

const Card = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.palette.background.default,
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
}));
