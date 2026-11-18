// 상품 구매 링크(공식몰 주소) 입력값 처리

// https://로 시작하는 올바른 주소인지 확인 (빈 값은 '링크 없음'으로 허용)
// DB에도 같은 조건(purchase_url ~ '^https://')이 걸려 있음
export const isValidPurchaseUrl = (value: string) => {
  const url = value.trim();

  if (!url) return true;
  if (!/^https:\/\/\S+$/.test(url)) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 저장용 값: 빈 값은 null(링크 없음)
export const toPurchaseUrlValue = (value: string) => value.trim() || null;
