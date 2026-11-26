// 제품 사진·타건음 출처 한 줄 ("출처 | YouTube 판교 뚜벅쵸")
// 출처는 상품(products.source_text) 단위로 저장, 링크 없이 텍스트만 표시
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

type SourceCreditProps = {
  text?: string | null;
  // 출처가 없어도 같은 높이를 비워 둘지 (비교 화면처럼 칸끼리 줄을 맞춰야 할 때)
  reserveSpace?: boolean;
  className?: string;
};

export default function SourceCredit({
  text,
  reserveSpace = false,
  className,
}: SourceCreditProps) {
  const value = text?.trim();

  if (!value) {
    return reserveSpace ? <CreditLine className={className} aria-hidden="true" /> : null;
  }

  return (
    <CreditLine className={className}>
      <span>출처</span>
      <CreditDivider aria-hidden="true">|</CreditDivider>
      <CreditValue>{value}</CreditValue>
    </CreditLine>
  );
}

const CreditLine = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  // 출처가 없어 비워 둘 때도 한 줄 높이 유지
  minHeight: "1.375rem",
  fontSize: "0.875rem",
  lineHeight: "1.375rem",
  color: theme.palette.text.secondary,
  textAlign: "center",
  wordBreak: "keep-all",
}));

const CreditDivider = styled("span")(({ theme }) => ({
  color: theme.palette.grey[300],
}));

const CreditValue = styled("span")(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
}));
