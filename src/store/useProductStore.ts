import { create } from "zustand";

interface Sound {
  sound_id: number;
  sound_url: string;
  sound_type: string;
}

interface Product {
  product_id: number;
  product_name: string;
  image_url: string | null;
  sounds: Sound[];
}

interface ProductStore {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product) => void;
}

// 선택된 제품 전역 상태
export const useProductStore = create<ProductStore>((set) => ({
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
}));
