import { supabase } from "@/api/supabaseClient";

//브랜드 등록
export async function createBrandClient(brandName: string) {
  const { data, error } = await supabase.from("brands").insert({ brand_name: brandName }).select().single();

  if (error) throw new Error(error.message);
  return data;
}

// 브랜드 삭제
export async function deleteBrandClient(brandId: number) {
  const { error } = await supabase.from("brands").delete().eq("brand_id", brandId);

  if (error) throw new Error(error.message);
}

// 브랜드 수정
export async function updateBrandClient(brandId: number, brandName: string) {
  const { error } = await supabase.from("brands").update({ brand_name: brandName }).eq("brand_id", brandId);

  if (error) throw new Error(error.message);
}
