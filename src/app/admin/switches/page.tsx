import { getSwitches } from "@/lib/api/switches";
import SwitchTable from "./_components/SwitchTable";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Server Component: 스위치 목록 fetch 후 SwitchTable에 넘겨줌
export default async function SwitchesPage() {
  const switches = await getSwitches();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        스위치 관리
      </Typography>
      <SwitchTable switches={switches ?? []} />
    </Box>
  );
}
