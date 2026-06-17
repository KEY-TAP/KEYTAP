import SwitchForm from "../_components/SwitchForm";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// 등록 페이지는 기존 데이터 없이 빈 폼으로 시작
export default function SwitchRegisterPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        스위치 등록
      </Typography>
      <SwitchForm />
    </Box>
  );
}
