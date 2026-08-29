import { create } from "zustand";

interface Sound {
  sound_id: number;
  sound_url: string;
  sound_type: string;
}

interface SwitchOption {
  switch_id: number;
  switch_name: string;
  switch_type: string;
  is_default: boolean;
  sounds: Sound[];
}

interface Product {
  product_id: number;
  product_name: string;
  image_url: string | null;
  switches: SwitchOption[];
}

interface ProductStore {
  selectedProduct: Product | null;
  selectedSwitchId: number | null;
  setSelectedProduct: (product: Product) => void;
  setSelectedSwitchId: (switchId: number) => void;
}

// 선택된 제품 + 그 제품 안에서 선택된 스위치 전역 상태
export const useProductStore = create<ProductStore>((set) => ({
  selectedProduct: null,
  selectedSwitchId: null,
  setSelectedProduct: (product) => {
    // 제품을 선택하면 기본 스위치(is_default)로 자동 선택, 없으면 첫 번째 스위치
    const defaultSwitch =
      product.switches.find((sw) => sw.is_default) ??
      product.switches[0] ??
      null;

    set({
      selectedProduct: product,
      selectedSwitchId: defaultSwitch?.switch_id ?? null,
    });
  },
  setSelectedSwitchId: (switchId) => set({ selectedSwitchId: switchId }),
}));
