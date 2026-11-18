// 누른 키에 맞는 타건음 고르기 (B안)
// - Space → spacebar 소리
// - Enter·Backspace·양쪽 Shift(숫자 패드 Enter 포함) → stabilizer 공용 소리
// - 그 외 키 → single 소리
// 해당 소리가 등록되지 않은 스위치는 single 소리로 대체

interface KeySound {
  sound_type: string;
  sound_url: string;
}

// 스테빌라이저가 들어가는 긴 키 (KeyboardEvent.code 기준)
const STABILIZER_KEY_CODES = new Set(["Enter", "NumpadEnter", "Backspace", "ShiftLeft", "ShiftRight"]);

// 키를 누를 때 재생하는 소리 유형 (미리 받아두기용)
export const KEY_SOUND_TYPES = ["single", "spacebar", "stabilizer"];

const getKeySoundType = (code?: string) => {
  if (code === "Space") return "spacebar";
  if (code && STABILIZER_KEY_CODES.has(code)) return "stabilizer";
  return "single";
};

export const findKeySound = <T extends KeySound>(sounds: T[], code?: string) =>
  sounds.find((sound) => sound.sound_type === getKeySoundType(code)) ?? sounds.find((sound) => sound.sound_type === "single");

// 모바일은 키 정보(code)가 오지 않아서 입력 종류로 스페이스·줄바꿈·지우기를 구분
export const getInputKeyCode = (event: Event) => {
  if (typeof InputEvent === "undefined" || !(event instanceof InputEvent)) return undefined;

  if (event.inputType === "deleteContentBackward") return "Backspace";
  if (event.inputType === "insertLineBreak" || event.inputType === "insertParagraph") return "Enter";
  if (event.data === " ") return "Space";

  return undefined;
};
