import { createClient } from "@/lib/supabaseServer";

// 브랜드 목록 + 각 브랜드에 등록된 제품 수 조회
export async function getBrandsWithProductCount() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("brands").select(`brand_id, brand_name, created_at, products(product_id)`).order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}
