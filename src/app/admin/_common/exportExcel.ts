// 관리자 '전체 목록 내보내기' 공용 엑셀(.xlsx) 생성

export type ExcelCell = string | number | null;

export interface ExcelSheet {
  // 시트 이름 (엑셀 하단 탭)
  name: string;
  // 첫 줄 제목
  headers: string[];
  rows: ExcelCell[][];
  // 열 너비 (글자 수 기준, headers와 같은 순서)
  widths?: number[];
}

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// DB 시간(UTC)을 한국 시간 날짜로 변환 → "2026-11-18"
export const toKstDate = (isoString: string) => new Date(new Date(isoString).getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);

// DB 시간(UTC)을 한국 시간 월로 변환 → "2026-11"
export const toKstMonth = (isoString: string) => toKstDate(isoString).slice(0, 7);

// 파일 이름에 붙일 오늘 날짜 (한국 시간)
export const getTodayKst = () => toKstDate(new Date().toISOString());

// 시트 데이터 → .xlsx 파일 내려받기
export async function downloadExcel(fileName: string, sheets: ExcelSheet[]) {
  // 엑셀 라이브러리는 버튼을 눌렀을 때만 불러옴 (관리자 외 페이지 용량에 영향 없도록)
  const { default: writeExcelFile } = await import("write-excel-file/browser");

  await writeExcelFile(
    sheets.map((sheet) => ({
      sheet: sheet.name,
      data: [sheet.headers.map((header) => ({ value: header, fontWeight: "bold" as const })), ...sheet.rows],
      columns: sheet.widths?.map((width) => ({ width })),
      // 아래로 스크롤해도 제목 줄이 보이도록 고정
      stickyRowsCount: 1,
    })),
  ).toFile(fileName);
}
