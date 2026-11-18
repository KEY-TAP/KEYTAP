// 상품 관리 '전체 목록 내보내기'
// 시트1: 상품·스위치별 누적 재생 수 / 시트2: 월별 × 상품·스위치별 재생 수

import { supabase } from "@/lib/supabaseClient";
import { downloadExcel, getTodayKst, toKstDate, toKstMonth, type ExcelCell } from "../../_common/exportExcel";

type BrandName = { brand_name: string };
type SwitchName = { switch_name: string };

// ProductTable에 넘어오는 상품 데이터 중 내보내기에 쓰는 값
// (Supabase JOIN 결과가 객체 또는 배열로 올 수 있어 둘 다 받음)
interface ExportProduct {
  product_name: string;
  created_at: string;
  brands: BrandName | BrandName[] | null;
  product_switches?:
    | {
        id: number;
        switches?: SwitchName | SwitchName[] | null;
        user_plays: { count: number }[] | null;
      }[]
    | null;
}

interface PlayRecord {
  fk_product_switch_id: number;
  played_at: string;
}

// 엑셀 한 줄 = 상품 + 스위치 조합 (스위치가 없는 상품은 id null)
interface ProductSwitchRow {
  id: number | null;
  brandName: string;
  productName: string;
  switchName: string;
  playCount: number;
  createdAt: string;
}

const pickOne = <T>(value: T | T[] | null | undefined) => (Array.isArray(value) ? value[0] : value) ?? null;

// Supabase는 한 번에 최대 1,000행만 돌려줘서 나눠서 끝까지 조회
const PAGE_SIZE = 1000;

async function fetchAllPlays() {
  const plays: PlayRecord[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("user_plays")
      .select("fk_product_switch_id, played_at")
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw new Error(error.message);

    plays.push(...data);

    if (data.length < PAGE_SIZE) break;
  }

  return plays;
}

export async function exportProducts(products: ExportProduct[]) {
  // 상품 + 스위치 조합 목록 (화면 표와 같은 순서)
  const productSwitches = products.flatMap((product): ProductSwitchRow[] => {
    const brandName = pickOne(product.brands)?.brand_name ?? "-";
    const switches = product.product_switches ?? [];

    // 스위치가 연결되지 않은 상품도 목록에 한 줄 표시
    if (switches.length === 0) {
      return [{ id: null, brandName, productName: product.product_name, switchName: "-", playCount: 0, createdAt: product.created_at }];
    }

    return switches.map((sw) => ({
      id: sw.id,
      brandName,
      productName: product.product_name,
      switchName: pickOne(sw.switches)?.switch_name ?? "-",
      playCount: sw.user_plays?.[0]?.count ?? 0,
      createdAt: product.created_at,
    }));
  });

  // 월별 재생 수 집계: 월 → (상품·스위치 id → 재생 수)
  const plays = await fetchAllPlays();
  const monthlyCounts = new Map<string, Map<number, number>>();

  plays.forEach((play) => {
    const month = toKstMonth(play.played_at);
    const counts = monthlyCounts.get(month) ?? new Map<number, number>();

    counts.set(play.fk_product_switch_id, (counts.get(play.fk_product_switch_id) ?? 0) + 1);
    monthlyCounts.set(month, counts);
  });

  const totalRows: ExcelCell[][] = productSwitches.map((item) => [item.brandName, item.productName, item.switchName, item.playCount, toKstDate(item.createdAt)]);

  // 재생 기록이 있는 조합만 표시 (월 오름차순, 같은 월은 화면 표 순서)
  const monthlyRows: ExcelCell[][] = [...monthlyCounts.keys()].sort().flatMap((month) =>
    productSwitches.flatMap((item) => {
      const count = item.id === null ? 0 : (monthlyCounts.get(month)?.get(item.id) ?? 0);

      return count > 0 ? [[month, item.brandName, item.productName, item.switchName, count]] : [];
    }),
  );

  await downloadExcel(`keytap_상품목록_${getTodayKst()}.xlsx`, [
    {
      name: "누적 재생 수",
      headers: ["브랜드", "상품명", "스위치", "누적 재생 수", "상품 등록일"],
      rows: totalRows,
      widths: [16, 36, 24, 14, 14],
    },
    {
      name: "월별 재생 수",
      headers: ["월", "브랜드", "상품명", "스위치", "재생 수"],
      rows: monthlyRows,
      widths: [10, 16, 36, 24, 10],
    },
  ]);
}
