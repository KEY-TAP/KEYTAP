// Storage 업로드 공용 설정

// 업로드 파일은 매번 새 경로로 저장하고 덮어쓰지 않으므로 브라우저·CDN에 1년간 캐시
// (캐시 기본값 1시간 → 같은 파일을 반복해서 받아 전송량이 늘어나는 것을 줄임)
export const STORAGE_CACHE_CONTROL = "31536000";

// 저장 경로용 파일 이름: 타임스탬프 + 임의 문자열 + 확장자
// - 원본 파일명(한글·공백·특수문자)은 Storage 경로에서 업로드 실패 원인이 되어 사용하지 않음
// - 여러 파일을 동시에 올릴 때 같은 밀리초가 겹쳐도 경로가 중복되지 않도록 임의 문자열 추가
// (crypto.randomUUID는 http로 접속한 개발 환경(예: 휴대폰에서 내부 IP 접속)에서 동작하지 않아 Math.random 사용)
export const createStorageFileName = (extension: string) => `${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${extension}`;
