// 브랜드 관리 '전체 목록 내보내기'

import { downloadExcel, getTodayKst, toKstDate } from "../../_common/exportExcel";

interface ExportBrand {
  brand_name: string;
  created_at: string;
  products: { product_id: number }[] | null;
}

export async function exportBrands(brands: ExportBrand[]) {
  await downloadExcel(`keytap_브랜드목록_${getTodayKst()}.xlsx`, [
    {
      name: "브랜드 목록",
      headers: ["브랜드명", "등록 제품 수", "등록일"],
      rows: brands.map((brand) => [brand.brand_name, brand.products?.length ?? 0, toKstDate(brand.created_at)]),
      widths: [24, 14, 14],
    },
  ]);
}
