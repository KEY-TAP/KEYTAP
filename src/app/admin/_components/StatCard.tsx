"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

interface StatCardProps {
  label: string;
  value: number;
  secondaryValue?: number;
}

export default function StatCard({ label, value, secondaryValue }: StatCardProps) {
  const hasSecondaryValue = secondaryValue !== undefined;

  return (
    <CardContainer>
      <CardLabel>{label}</CardLabel>

      <ValueContainer>
        <ValueText>{value.toLocaleString("ko-KR")}</ValueText>

        {hasSecondaryValue && (
          <>
            <ValueSeparator aria-hidden="true">/</ValueSeparator>

            <ValueText>{secondaryValue.toLocaleString("ko-KR")}</ValueText>
          </>
        )}
      </ValueContainer>
    </CardContainer>
  );
}

const CardContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  padding: "0 20px 0 0",
  boxSizing: "border-box",

  overflow: "hidden",
}));

const CardLabel = styled("p")(({ theme }) => ({
  ...theme.typography.body2,
  margin: 0,

  marginBottom: "8px",
  fontSize: "1rem",
  fontWeight: "400",
  color: theme.palette.grey[600],
}));

const ValueContainer = styled(Box)(() => ({
  display: "flex",
  marginTop: 0,
  whiteSpace: "nowrap",
}));

const ValueText = styled("strong")(({ theme }) => ({
  ...theme.typography.h2,

  color: theme.palette.grey[900],
  fontSize: "1.875rem",
  fontWeight: 700,
}));

const ValueSeparator = styled("span")(({ theme }) => ({
  ...theme.typography.h2,

  margin: `0 ${theme.spacing(0.75)}`,
  color: theme.palette.text.secondary,
  fontWeight: 500,
}));
