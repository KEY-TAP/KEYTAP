export interface ProductPayload {
  product_name: string;
  fk_brand_id: number;
  product_type: string;
  description: string;
  hashtags: string;
}

export interface Brand {
  brand_id: number;
  brand_name: string;
}

export interface ProductImage {
  image_id: number;
  image_url: string;
  is_primary: boolean;
}

// 상품-스위치 연결 타입
export interface ProductSwitch {
  fk_switch_id: number;
}

export interface EditableProduct {
  product_id: number;
  product_name: string;
  product_type: string | null;
  description: string | null;
  hashtags: string | null;
  fk_brand_id: number;
  brands:
    | {
        brand_name: string;
      }[]
    | null; // Supabase JOIN 결과는 배열로 반환됨
  product_images: ProductImage[] | null;
  product_switches: ProductSwitch[] | null; // ← 추가
}
