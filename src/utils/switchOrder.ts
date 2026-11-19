// 스위치 버튼 순서: 기본 스위치 맨 앞, 나머지는 이름순
// 숫자는 사람이 읽는 순서로 비교 (스타일2 → 스타일10)

const nameCollator = new Intl.Collator("ko", { numeric: true, sensitivity: "base" });

interface SortableSwitch {
  is_default: boolean;
  switch_name: string;
}

export const compareSwitches = (a: SortableSwitch, b: SortableSwitch) =>
  Number(b.is_default) - Number(a.is_default) || nameCollator.compare(a.switch_name, b.switch_name);
