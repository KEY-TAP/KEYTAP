import { getSwitchById } from "@/lib/api/switches";
import SwitchForm from "../../_components/SwitchForm";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SwitchEditPage({ params }: Props) {
  const { id } = await params;
  const switchData = await getSwitchById(Number(id));

  if (!switchData) return null;

  // Supabase JOIN 결과 타입을 SwitchForm이 기대하는 타입으로 변환
  const formattedData = {
    switch_id: switchData.switch_id,
    switch_name: switchData.switch_name,
    switch_type: switchData.switch_type,
    manufacture: switchData.manufacture,
    sounds: (switchData.sounds ?? []).map((s) => ({
      sound_id: s.sound_id,
      sound_url: s.sound_url,
      sound_type: s.sound_type,
    })),
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        스위치 수정
      </Typography>
      <SwitchForm switchData={formattedData} />
    </Box>
  );
}
