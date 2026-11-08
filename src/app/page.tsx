import Header from "@/common/layout/Header";
import Footer from "@/common/layout/Footer";
import LandingPage, { type LandingBrand } from "@/common/components/LandingPage/LandingPage";
import type { HeroImage } from "@/common/components/LandingPage/HeroSlider";
import { getBrandsWithProductCount } from "@/lib/api/brands";

// 히어로 슬라이드 사진 (출처: public/hero/CREDITS.md)
const HERO_IMAGES: HeroImage[] = [
  { src: "/hero/keyboard-01.jpg", alt: "흰색 키캡에 연두색 포인트 키가 들어간 기계식 키보드" },
  { src: "/hero/keyboard-02.jpg", alt: "여러 색의 키캡이 끼워진 기계식 키보드" },
  { src: "/hero/keyboard-03.jpg", alt: "분홍색에서 주황색으로 이어지는 키캡의 기계식 키보드" },
  { src: "/hero/keyboard-04.jpg", alt: "책상 위에 흩어진 여러 색의 키캡" },
];

// 접속할 때마다 사진 순서를 새로 섞기 위해 항상 요청 시점에 렌더링
export const dynamic = "force-dynamic";

// Explore Brands에 보여줄 브랜드 수
const BRAND_COUNT = 4;

// 배열 순서를 무작위로 섞기 (원본은 그대로 두고 새 배열 반환)
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 등록 제품이 많은 순으로 브랜드 뽑기 (제품이 0개인 브랜드도 포함)
async function getLandingBrands(): Promise<LandingBrand[]> {
  try {
    const brands = await getBrandsWithProductCount();

    return (brands ?? [])
      .map((brand) => ({
        brand_id: brand.brand_id,
        brand_name: brand.brand_name,
        product_count: brand.products?.length ?? 0,
      }))
      .sort(
        (a, b) =>
          b.product_count - a.product_count ||
          a.brand_name.localeCompare(b.brand_name, "ko"),
      )
      .slice(0, BRAND_COUNT);
  } catch {
    // 브랜드를 못 불러와도 첫 화면은 보여주고 브랜드 영역만 숨김
    return [];
  }
}

export default async function Home() {
  // 페이지 요청마다 다시 실행되어 접속할 때마다 사진 순서가 바뀜
  const heroImages = shuffle(HERO_IMAGES);
  const brands = await getLandingBrands();

  return (
    <>
      <Header />
      <LandingPage heroImages={heroImages} brands={brands} />
      <Footer />
    </>
  );
}
