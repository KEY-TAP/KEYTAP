// 스위치 관리 '전체 목록 내보내기'

import { downloadExcel, getTodayKst, toKstDate } from "../../_common/exportExcel";

interface ExportSwitch {
  switch_name: string;
  switch_type: string;
  manufacture: string | null;
  created_at: string;
  sounds: { sound_type: string }[] | null;
}

const countSounds = (sounds: ExportSwitch["sounds"], soundType: string) => sounds?.filter((sound) => sound.sound_type === soundType).length ?? 0;

export async function exportSwitches(switches: ExportSwitch[]) {
  await downloadExcel(`keytap_스위치목록_${getTodayKst()}.xlsx`, [
    {
      name: "스위치 목록",
      headers: ["스위치명", "스위치 타입", "제조사", "단타음(개)", "연속음(개)", "스페이스바(개)", "스테빌라이저(개)", "등록일"],
      rows: switches.map((sw) => [sw.switch_name, sw.switch_type, sw.manufacture ?? "-", countSounds(sw.sounds, "single"), countSounds(sw.sounds, "long"), countSounds(sw.sounds, "spacebar"), countSounds(sw.sounds, "stabilizer"), toKstDate(sw.created_at)]),
      widths: [24, 14, 16, 12, 12, 14, 16, 14],
    },
  ]);
}
