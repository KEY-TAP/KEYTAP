import { createClient } from "@/lib/supabaseServer";
import { Brand, EditableProduct, ProductPayload } from "@/types/product";

// 상품 목록 조회
// 브랜드명까지 함께 가져옴
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
      hashtags,
      created_at,
      brands (
        brand_name
      )
    `,
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

// 상품 등록
export async function createProduct(payload: ProductPayload) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("products").insert(payload).select().single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// 상품 삭제
export async function deleteProduct(productId: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("product_id", productId);

  if (error) {
    throw new Error(error.message);
  }
}

// 이미지 Storage 업로드 후 DB에 URL 저장
export async function uploadProductImage(file: File, productId: number) {
  const supabase = await createClient();

  const fileExt = file.name.split(".").pop();
  const filePath = `${productId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(filePath);

  const { error: dbError } = await supabase.from("product_images").insert({
    fk_product_id: productId,
    image_url: publicUrl,
    is_primary: false,
  });

  if (dbError) {
    throw new Error(dbError.message);
  }

  return publicUrl;
}

// Storage 파일과 DB 이미지 레코드 삭제
export async function deleteProductImage(imageId: number, imageUrl: string) {
  const supabase = await createClient();

  const filePath = imageUrl.split("/product-images/")[1];

  if (!filePath) {
    throw new Error("상품 이미지의 Storage 경로를 찾을 수 없습니다.");
  }

  const { error: storageError } = await supabase.storage.from("product-images").remove([filePath]);

  if (storageError) {
    throw new Error(storageError.message);
  }

  const { error: dbError } = await supabase.from("product_images").delete().eq("image_id", imageId);

  if (dbError) {
    throw new Error(dbError.message);
  }
}

// 브랜드 목록 조회
export async function getBrands(): Promise<Brand[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brands")
    .select(
      `
      brand_id,
      brand_name
    `,
    )
    .order("brand_name", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

// 특정 상품 1개 조회
export async function getProductById(productId: number): Promise<EditableProduct> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      product_id,
      product_name,
      product_type,
      description,
      hashtags,
      fk_brand_id,
      brands (
        brand_name
      ),
      product_images (
        image_id,
        image_url,
        is_primary
      )
    `,
    )
    .eq("product_id", productId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as EditableProduct;
}
