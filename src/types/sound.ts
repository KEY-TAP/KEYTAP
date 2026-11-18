// 스위치 소리 유형 (DB sound_type_enum 중 관리자에서 등록하는 값)
// - single: 일반 키 단타음
// - long: 연속 타이핑음 (재생 버튼)
// - spacebar: 스페이스바 단타음
// - stabilizer: Enter·Backspace·Shift 공용 단타음
export type SoundType = "single" | "long" | "spacebar" | "stabilizer";

// 관리자 화면에 보여줄 이름 (선택지 순서)
export const SOUND_TYPE_LABELS: Record<SoundType, string> = {
  single: "Single",
  long: "Long",
  spacebar: "Spacebar",
  stabilizer: "Stabilizer",
};
