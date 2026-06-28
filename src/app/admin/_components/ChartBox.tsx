"use client";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

interface Props {
  children: React.ReactNode;
}

export default function ChartBox({ children }: Props) {
  return <StyledBox>{children}</StyledBox>;
}

const StyledBox = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.palette.background.default,
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
}));
