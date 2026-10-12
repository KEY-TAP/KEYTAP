import { supabase } from "@/lib/supabaseClient";

// 현재 로그인한 유저 id (비로그인 시 null)
export async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

// 상품 찜하기 (어떤 스위치를 선택한 상태로 찜했는지도 같이 저장)
export async function likeProductClient(
  userId: string,
  productId: number,
  productSwitchId?: number | null,
) {
  const { error } = await supabase.from("user_product_likes").insert({
    fk_user_id: userId,
    fk_product_id: productId,
    fk_product_switch_id: productSwitchId ?? null,
  });

  if (error) throw new Error(error.message);
}

// 이미 찜한 상품의 스위치 변경 (찜 해제 후 다시 찜하지 않아도 되게)
export async function updateLikedSwitchClient(
  userId: string,
  productId: number,
  productSwitchId: number,
) {
  const { data, error } = await supabase
    .from("user_product_likes")
    .update({ fk_product_switch_id: productSwitchId })
    .eq("fk_user_id", userId)
    .eq("fk_product_id", productId)
    .select("id");

  if (error) throw new Error(error.message);

  // RLS update 정책이 없으면 에러 없이 0건만 바뀌어서 따로 체크해줌
  if (!data || data.length === 0) {
    throw new Error("찜한 스위치를 변경하지 못했습니다.");
  }
}

// 상품 찜 해제
export async function unlikeProductClient(userId: string, productId: number) {
  const { error } = await supabase
    .from("user_product_likes")
    .delete()
    .eq("fk_user_id", userId)
    .eq("fk_product_id", productId);

  if (error) throw new Error(error.message);
}
