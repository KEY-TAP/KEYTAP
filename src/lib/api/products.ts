import { createClient } from "@/lib/supabaseServer";

// 상품 목록 (브랜드명 포함해서 가져옴)
export async function getProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      product_id,
      product_name,
      product_type,
      description,
      created_at,
      brands (
        brand_name
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// 상품 등록
export async function createProduct(payload: { product_name: string; fk_brand_id: number; product_type: string; description: string }) {
  const supabase = await createClient();

  // insert 후 .select().single()로 등록된 상품 데이터 바로 반환
  const { data, error } = await supabase.from("products").insert(payload).select().single();

  if (error) throw new Error(error.message);
  return data;
}

// 상품 삭제
export async function deleteProduct(productId: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("product_id", productId);

  if (error) throw new Error(error.message);
}

// 이미지 Storage 업로드 후 DB에 URL 저장
export async function uploadProductImage(file: File, productId: number) {
  const supabase = await createClient();

  // 파일명 중복 방지를 위해 timestamp 사용
  const fileExt = file.name.split(".").pop();
  const filePath = `${productId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  // Storage에서 공개 URL 가져오기
  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(filePath);

  // URL을 product_images 테이블에 저장
  const { error: dbError } = await supabase.from("product_images").insert({
    fk_product_id: productId,
    image_url: publicUrl,
    is_primary: false,
  });

  if (dbError) throw new Error(dbError.message);

  return publicUrl;
}

// Storage 파일 삭제 + DB 레코드 삭제
export async function deleteProductImage(imageId: number, imageUrl: string) {
  const supabase = await createClient();

  // URL에서 파일 경로만 추출
  const filePath = imageUrl.split("/product-images/")[1];

  const { error: storageError } = await supabase.storage.from("product-images").remove([filePath]);

  if (storageError) throw new Error(storageError.message);

  const { error: dbError } = await supabase.from("product_images").delete().eq("image_id", imageId);

  if (dbError) throw new Error(dbError.message);
}

// 브랜드 목록 (등록 폼 셀렉트박스용)
export async function getBrands() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("brands").select("brand_id, brand_name").order("brand_name");

  if (error) throw new Error(error.message);
  return data;
}

// 특정 상품 1개 조회(상품관리 페이지에서 특정 상품 수정 버튼 눌렀을 때 기존 데이터 불러올떄 사용)

export async function getProductById(productId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("products").select(`product_id, product_name, product_type, description, fk_brand_id, brands(brand_name), product_images(image_id, image_url, is_primary)`).eq("product_id", productId).single(); // 1개만 반환

  if (error) throw new Error(error.message);
  return data;
}
