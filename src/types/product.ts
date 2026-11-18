export interface ProductPayload {
  product_name: string;
  fk_brand_id: number;
  product_type: string;
  description: string;
  hashtags: string;
  // 공식몰 구매 링크 (없으면 null)
  purchase_url: string | null;
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

export interface EditableProduct {
  product_id: number;
  product_name: string;
  product_type: string | null;
  description: string | null;
  hashtags: string | null;
  purchase_url: string | null;
  fk_brand_id: number;
  brands: {
    brand_name: string;
  }[] | null;
  product_images: ProductImage[] | null;
  switch_ids: number[];
}
