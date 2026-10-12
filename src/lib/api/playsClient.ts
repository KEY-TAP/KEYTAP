import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserId } from "@/lib/api/likesClient";

// 타건음 재생 기록 저장 (관리자 페이지 재생 횟수 집계용)
// product_switch_id = product_switches 테이블의 id (상품 + 스위치 조합)
export async function recordPlayClient(productSwitchId: number) {
  // 비로그인이면 fk_user_id는 null로 저장
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("user_plays").insert({
    fk_product_switch_id: productSwitchId,
    fk_user_id: userId,
  });

  if (error) throw new Error(error.message);
}
