import { create } from "zustand";

interface BottomSheetStore {
  // 바텀시트 열림 여부 (MainLayout의 시트, 메인 정보 아래 More 버튼이 함께 사용)
  isOpen: boolean;
  // 제품 정보 아래 More 버튼이 화면(또는 바로 아래)에 보이는지
  // null: 아직 확인 전 → 떠 있는 More 버튼은 숨김 (첫 화면에서 잠깐 보였다 사라지는 것 방지)
  inlineMoreVisible: boolean | null;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  setInlineMoreVisible: (visible: boolean | null) => void;
}

export const useBottomSheetStore = create<BottomSheetStore>((set) => ({
  isOpen: false,
  inlineMoreVisible: null,
  setOpen: (open) => set({ isOpen: open }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setInlineMoreVisible: (visible) => set({ inlineMoreVisible: visible }),
}));
