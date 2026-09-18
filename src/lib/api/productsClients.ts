// 클라이언트 전용 API
// Client Component에서만 사용

import { supabase } from "@/lib/supabaseClient";
import { ProductPayload } from "@/types/product";

// 상품 삭제
export async function deleteProductClient(productId: number) {
  const { error } = await supabase.from("products").delete().eq("product_id", productId);

  if (error) {
    throw new Error(error.message);
  }
}

// 상품 등록
export async function createProductClient(payload: ProductPayload) {
  const { data, error } = await supabase.from("products").insert(payload).select().single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// 이미지 Storage 업로드 후 DB에 URL 저장
export async function uploadProductImageClient(file: File, productId: number, isPrimary: boolean = false) {
  const fileExt = file.name.split(".").pop();
  const filePath = `${productId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(filePath);

  // 이번 이미지를 대표 이미지로 지정하는 경우, 기존 대표 이미지는 해제
  if (isPrimary) {
    const { error: resetError } = await supabase.from("product_images").update({ is_primary: false }).eq("fk_product_id", productId);

    if (resetError) {
      throw new Error(resetError.message);
    }
  }

  const { error: dbError } = await supabase.from("product_images").insert({
    fk_product_id: productId,
    image_url: publicUrl,
    is_primary: isPrimary,
  });

  if (dbError) {
    throw new Error(dbError.message);
  }

  return publicUrl;
}

// 상품-스위치 연결
export async function linkSwitchToProductClient(productId: number, switchId: number, optionName?: string, isDefault?: boolean) {
  const { error } = await supabase.from("product_switches").insert({
    fk_product_id: productId,
    fk_switch_id: switchId,
    option_name: optionName ?? null,
    is_default: isDefault ?? false,
  });

  if (error) throw new Error(error.message);
}

// 상품-스위치 연결 전체 삭제 (수정 시 기존 연결 초기화용)
export async function unlinkSwitchFromProductClient(productId: number) {
  const { error } = await supabase.from("product_switches").delete().eq("fk_product_id", productId);

  if (error) throw new Error(error.message);
}

// 상품 수정
export async function updateProductClient(productId: number, payload: ProductPayload) {
  const { error } = await supabase.from("products").update(payload).eq("product_id", productId);

  if (error) {
    throw new Error(error.message);
  }
}
