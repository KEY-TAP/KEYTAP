import { supabase } from "@/lib/supabaseClient";

// 현재 로그인한 유저 id (비로그인 시 null)
export async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

// 상품 찜하기
export async function likeProductClient(userId: string, productId: number) {
  const { error } = await supabase
    .from("user_product_likes")
    .insert({ fk_user_id: userId, fk_product_id: productId });

  if (error) throw new Error(error.message);
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
