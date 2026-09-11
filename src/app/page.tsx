import LandingPage from "@/common/components/LandingPage/LandingPage";
import { getMainProducts } from "@/lib/api/mainProducts";

// 등록된 상품 중 서로 다른 것을 최대 count개 랜덤으로 뽑기
function pickRandomProducts<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default async function Home() {
  // 서버에서 등록된 상품 목록 fetch (페이지 요청마다 다시 실행되어 접속할 때마다 랜덤 결과가 바뀜)
  const products = await getMainProducts();

  // 인트로 말풍선 2개에 각각 보여줄 랜덤 상품
  // - 상품이 2개 이상이면 서로 다른 상품 2개
  // - 상품이 1개뿐이면 동일 상품을 재사용
  // - 등록된 상품이 없으면 빈 배열 (말풍선 미표시)
  const bubbleProducts =
    products.length === 0
      ? []
      : products.length === 1
        ? [products[0], products[0]]
        : pickRandomProducts(products, 2);

  return (
    <div>
      <LandingPage bubbleProducts={bubbleProducts} />
    </div>
  );
}
