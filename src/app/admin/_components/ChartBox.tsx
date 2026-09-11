"use client";

import type { ReactNode } from "react";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

interface ChartBoxProps {
  title: string;
  children: ReactNode;
}

export default function ChartBox({ title, children }: ChartBoxProps) {
  return (
    <ChartContainer>
      <ChartTitle>{title}</ChartTitle>

      <ChartContent>{children}</ChartContent>
    </ChartContainer>
  );
}

const ChartContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",

  width: "100%",
  padding: "0 20px 0 0",
  boxSizing: "border-box",

  overflow: "hidden",
}));

const ChartTitle = styled("h2")(({ theme }) => ({
  ...theme.typography.body2,

  margin: 0,
  marginBottom: "50px",
  fontSize: "1rem",
  fontWeight: "400",
  color: theme.palette.grey[600],
}));

const ChartContent = styled(Box)(() => ({
  position: "relative",
  flex: 1,

  width: "100%",
  minWidth: 0,
  minHeight: 0,

  overflow: "hidden",
}));
