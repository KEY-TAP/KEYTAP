import SwitchForm from "../_components/SwitchForm";
import Box from "@mui/material/Box";
import Header from "../../_components/Header";

// 등록 페이지는 기존 데이터 없이 빈 폼으로 시작
export default function SwitchRegisterPage() {
  return (
    <Box>
      {/* 헤더 */}
      <Header title="스위치 등록" />

      <SwitchForm />
    </Box>
  );
}
