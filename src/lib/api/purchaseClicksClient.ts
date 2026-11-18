import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserId } from "@/lib/api/likesClient";

// '구매하러 가기' 클릭 기록 저장 (관리자 엑셀 구매 클릭 수 집계용)
// productSwitchId = 클릭할 때 선택돼 있던 스위치 (product_switches.id), 없으면 null
export async function recordPurchaseClickClient(productId: number, productSwitchId: number | null) {
  // 비로그인이면 fk_user_id는 null로 저장
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("purchase_clicks").insert({
    fk_product_id: productId,
    fk_product_switch_id: productSwitchId,
    fk_user_id: userId,
  });

  if (error) throw new Error(error.message);
}
