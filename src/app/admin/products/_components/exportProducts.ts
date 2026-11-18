// 상품 관리 '전체 목록 내보내기'
// 시트1: 상품·스위치별 누적 재생 수·구매 클릭 수 / 시트2: 월별 × 상품·스위치별 재생 수·구매 클릭 수

import { supabase } from "@/lib/supabaseClient";
import { downloadExcel, getTodayKst, toKstDate, toKstMonth, type ExcelCell } from "../../_common/exportExcel";

type BrandName = { brand_name: string };
type SwitchName = { switch_name: string };

// ProductTable에 넘어오는 상품 데이터 중 내보내기에 쓰는 값
// (Supabase JOIN 결과가 객체 또는 배열로 올 수 있어 둘 다 받음)
interface ExportProduct {
  product_id: number;
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

interface ClickRecord {
  fk_product_id: number;
  fk_product_switch_id: number | null;
  clicked_at: string;
}

// 엑셀 한 줄 = 상품 + 스위치 조합
// switchId가 null인 줄: 스위치가 없는 상품, 또는 스위치 정보 없이 기록된 구매 클릭
interface ProductSwitchRow {
  productId: number;
  switchId: number | null;
  brandName: string;
  productName: string;
  switchName: string;
  playCount: number;
  createdAt: string;
}

const pickOne = <T>(value: T | T[] | null | undefined) => (Array.isArray(value) ? value[0] : value) ?? null;

// Supabase는 한 번에 최대 1,000행만 돌려줘서 나눠서 끝까지 조회
const PAGE_SIZE = 1000;

async function fetchAllRows<Row>(table: "user_plays" | "purchase_clicks", columns: string) {
  const rows: Row[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw new Error(error.message);

    rows.push(...(data as Row[]));

    if (data.length < PAGE_SIZE) break;
  }

  return rows;
}

// 줄 구분용 키 (같은 상품 안에서 스위치별로 구분)
const rowKey = (productId: number, switchId: number | null) => `${productId}:${switchId ?? "none"}`;

// 키별 개수 더하기
const addCount = (counts: Map<string, number>, key: string) => counts.set(key, (counts.get(key) ?? 0) + 1);

export async function exportProducts(products: ExportProduct[]) {
  const [plays, clicks] = await Promise.all([
    fetchAllRows<PlayRecord>("user_plays", "fk_product_switch_id, played_at"),
    fetchAllRows<ClickRecord>("purchase_clicks", "fk_product_id, fk_product_switch_id, clicked_at"),
  ]);

  // 상품 + 스위치 조합 목록 (화면 표와 같은 순서)
  const rows = products.flatMap((product): ProductSwitchRow[] => {
    const base = {
      productId: product.product_id,
      brandName: pickOne(product.brands)?.brand_name ?? "-",
      productName: product.product_name,
      createdAt: product.created_at,
    };

    const switchRows: ProductSwitchRow[] = (product.product_switches ?? []).map((sw) => ({
      ...base,
      switchId: sw.id,
      switchName: pickOne(sw.switches)?.switch_name ?? "-",
      playCount: sw.user_plays?.[0]?.count ?? 0,
    }));

    // 스위치 정보 없이 기록된 구매 클릭이 있으면 따로 한 줄 (스위치가 없는 상품도 한 줄 표시)
    const hasClickWithoutSwitch = clicks.some(
      (click) => click.fk_product_id === product.product_id && !switchRows.some((row) => row.switchId === click.fk_product_switch_id),
    );

    if (switchRows.length === 0 || hasClickWithoutSwitch) {
      switchRows.push({ ...base, switchId: null, switchName: switchRows.length === 0 ? "-" : "스위치 정보 없음", playCount: 0 });
    }

    return switchRows;
  });

  // 상품·스위치 조합 키 찾기 (구매 클릭은 지금 연결된 스위치가 아니면 '스위치 정보 없음' 줄로)
  const productIdBySwitchId = new Map(rows.filter((row) => row.switchId !== null).map((row) => [row.switchId, row.productId]));
  const clickKey = (click: ClickRecord) =>
    productIdBySwitchId.get(click.fk_product_switch_id) === click.fk_product_id
      ? rowKey(click.fk_product_id, click.fk_product_switch_id)
      : rowKey(click.fk_product_id, null);

  // 누적 구매 클릭 수
  const totalClicks = new Map<string, number>();
  clicks.forEach((click) => addCount(totalClicks, clickKey(click)));

  // 월별 재생 수·구매 클릭 수: 월 → (줄 키 → 개수)
  const monthlyPlays = new Map<string, Map<string, number>>();
  const monthlyClicks = new Map<string, Map<string, number>>();

  const addMonthly = (target: Map<string, Map<string, number>>, month: string, key: string) => {
    const counts = target.get(month) ?? new Map<string, number>();
    addCount(counts, key);
    target.set(month, counts);
  };

  plays.forEach((play) => {
    const productId = productIdBySwitchId.get(play.fk_product_switch_id);
    if (productId === undefined) return;
    addMonthly(monthlyPlays, toKstMonth(play.played_at), rowKey(productId, play.fk_product_switch_id));
  });

  clicks.forEach((click) => addMonthly(monthlyClicks, toKstMonth(click.clicked_at), clickKey(click)));

  const totalRows: ExcelCell[][] = rows.map((row) => [
    row.brandName,
    row.productName,
    row.switchName,
    row.playCount,
    totalClicks.get(rowKey(row.productId, row.switchId)) ?? 0,
    toKstDate(row.createdAt),
  ]);

  // 재생이나 클릭 기록이 있는 조합만 표시 (월 오름차순, 같은 월은 화면 표 순서)
  const months = [...new Set([...monthlyPlays.keys(), ...monthlyClicks.keys()])].sort();

  const monthlyRows: ExcelCell[][] = months.flatMap((month) =>
    rows.flatMap((row) => {
      const key = rowKey(row.productId, row.switchId);
      const playCount = monthlyPlays.get(month)?.get(key) ?? 0;
      const clickCount = monthlyClicks.get(month)?.get(key) ?? 0;

      return playCount > 0 || clickCount > 0 ? [[month, row.brandName, row.productName, row.switchName, playCount, clickCount]] : [];
    }),
  );

  await downloadExcel(`keytap_상품목록_${getTodayKst()}.xlsx`, [
    {
      name: "누적",
      headers: ["브랜드", "상품명", "스위치", "누적 재생 수", "누적 구매 클릭 수", "상품 등록일"],
      rows: totalRows,
      widths: [16, 36, 24, 14, 18, 14],
    },
    {
      name: "월별",
      headers: ["월", "브랜드", "상품명", "스위치", "재생 수", "구매 클릭 수"],
      rows: monthlyRows,
      widths: [10, 16, 36, 24, 10, 14],
    },
  ]);
}
