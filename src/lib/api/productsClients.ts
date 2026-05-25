// 클라이언트 전용 API (Client Component에서만 사용)
import { supabase } from "@/lib/supabaseClient";

// 상품 삭제
export async function deleteProductClient(productId: number) {
  const { error } = await supabase.from("products").delete().eq("product_id", productId);

  if (error) throw new Error(error.message);
}

// 상품 등록
export async function createProductClient(payload: { product_name: string; fk_brand_id: number; product_type: string; description: string }) {
  const { data, error } = await supabase.from("products").insert(payload).select().single();

  if (error) throw new Error(error.message);
  return data;
}

// 이미지 Storage 업로드 후 DB에 URL 저장
export async function uploadProductImageClient(file: File, productId: number) {
  const fileExt = file.name.split(".").pop();
  const filePath = `${productId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(filePath);

  const { error: dbError } = await supabase.from("product_images").insert({
    fk_product_id: productId,
    image_url: publicUrl,
    is_primary: false,
  });

  if (dbError) throw new Error(dbError.message);

  return publicUrl;
}

// 상품 수정
export async function updateProductClient(
  productId: number,
  payload: {
    product_name: string;
    fk_brand_id: number;
    product_type: string;
    description: string;
  },
) {
  const { error } = await supabase.from("products").update(payload).eq("product_id", productId);

  if (error) throw new Error(error.message);
}
