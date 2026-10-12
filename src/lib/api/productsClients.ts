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

// 상품-스위치 연결 동기화 (수정 시 사용)
// 전부 지우고 다시 만들면 product_switches.id가 바뀌어서 재생 기록(cascade 삭제)이랑
// 찜한 스위치 정보가 날아가니까, 빠진 스위치만 지우고 새로 생긴 스위치만 추가해줌
export async function syncProductSwitchesClient(productId: number, switchIds: number[]) {
  const { data: existing, error: selectError } = await supabase.from("product_switches").select("id, fk_switch_id").eq("fk_product_id", productId);

  if (selectError) throw new Error(selectError.message);

  const existingRows = existing ?? [];

  // 체크 해제된 스위치 연결만 삭제
  const removeIds = existingRows.filter((row) => !switchIds.includes(row.fk_switch_id)).map((row) => row.id);

  if (removeIds.length > 0) {
    const { error } = await supabase.from("product_switches").delete().in("id", removeIds);
    if (error) throw new Error(error.message);
  }

  // 새로 체크된 스위치만 추가
  const existingSwitchIds = existingRows.map((row) => row.fk_switch_id);
  const addRows = switchIds
    .filter((switchId) => !existingSwitchIds.includes(switchId))
    .map((switchId) => ({ fk_product_id: productId, fk_switch_id: switchId, option_name: null, is_default: false }));

  if (addRows.length > 0) {
    const { error } = await supabase.from("product_switches").insert(addRows);
    if (error) throw new Error(error.message);
  }

  // 기본 스위치는 기존처럼 체크한 순서의 첫 번째로 맞춰줌
  if (switchIds.length > 0) {
    const { error: resetError } = await supabase.from("product_switches").update({ is_default: false }).eq("fk_product_id", productId);
    if (resetError) throw new Error(resetError.message);

    const { error: defaultError } = await supabase.from("product_switches").update({ is_default: true }).eq("fk_product_id", productId).eq("fk_switch_id", switchIds[0]);
    if (defaultError) throw new Error(defaultError.message);
  }
}

// 상품 수정
export async function updateProductClient(productId: number, payload: ProductPayload) {
  const { error } = await supabase.from("products").update(payload).eq("product_id", productId);

  if (error) {
    throw new Error(error.message);
  }
}
