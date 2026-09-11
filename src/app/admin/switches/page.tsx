import { getSwitches } from "@/lib/api/switches";
import SwitchTable from "./_components/SwitchTable";
import Box from "@mui/material/Box";
import Header from "../_components/Header";

// Server Component: 스위치 목록 fetch 후 SwitchTable에 넘겨줌
export default async function SwitchesPage() {
  const switches = await getSwitches();

  return (
    <Box>
      {/* 헤더 */}
      <Header title="스위치 관리" />

      <SwitchTable switches={switches ?? []} />
    </Box>
  );
}
