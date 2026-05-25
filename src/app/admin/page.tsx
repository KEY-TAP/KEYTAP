import { createClient } from "@/lib/supabaseServer";
import DashboardLayout from "./_components/DashboardLayout";

interface LikeRow {
  fk_product_id: number;
  products: {
    product_name: string;
    brands: { brand_name: string } | null;
  } | null;
}

export default async function AdminHome() {
  const supabase = await createClient();

  // 오늘 날짜 00:00:00 기준으로 설정
  const today = new Date(); // 현재 시간(예: 2026-04-22 20:35:10)
  today.setHours(0, 0, 0, 0); // 오늘 가입자를 구하기 위해 시간을 전부 0으로 초기화 (예: 2026-04-22 00:00:00)
  const todayISO = today.toISOString(); // js Date 객체를 Supabase가 읽을 수 있는 문자열로 변환(예: 2026-04-22T00:00:00.000Z")

  // 오늘 가입자 수
  // count: exact, head: true = 데이터 내용 말고 count 숫자만 정확하게 가져오기
  // SELECT COUNT(*) FROM users WHERE created_at >= '오늘날짜' 구문과 동일함
  const { count: todayUsers } = await supabase.from("users").select("*", { count: "exact", head: true }).gte("created_at", todayISO); // gte = greater than or equal (이상)

  // 총 유저 수
  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true });

  // 오늘 재생 수
  const { count: todayPlays } = await supabase.from("user_plays").select("*", { count: "exact", head: true }).gte("played_at", todayISO);

  // 최근 7일 재생 수 (차트용)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 오늘 포함 7일
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data: playsRaw } = await supabase.from("user_plays").select("played_at").gte("played_at", sevenDaysAgo.toISOString());

  // 날짜별로 재생 수 집계
  // 먼저 7일치 날짜를 0으로 초기화
  const playsByDate: Record<string, number> = {}; // 빈 객체 생성
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const key = `${d.getMonth() + 1}/${d.getDate()}`; // "4/20" 형태
    playsByDate[key] = 0;
  }

  // 실제 데이터로 카운트 증가
  playsRaw?.forEach(({ played_at }) => {
    const d = new Date(played_at);
    const key = `${d.getMonth() + 1}/${d.getDate()}`; // getMonth() + 1 이유: js는 0월부터 시작함
    if (key in playsByDate) playsByDate[key]++;
  });

  // Recharts가 쓸 수 있는 배열 형태로 변환
  const chartData = Object.entries(playsByDate).map(([date, count]) => ({
    date,
    count,
  }));

  // 인기 제품 (좋아요 기준 top 5)
  // products(product_name, brands(brand_name)) = JOIN 쿼리
  const { data: popularRaw } = await supabase.from("user_product_likes").select("fk_product_id, products(product_name, brands(brand_name))");

  // 제품별 좋아요 수 집계
  const likeCount: Record<string, { name: string; brand: string; count: number }> = {};

  popularRaw?.forEach((row) => {
    const typedRow = row as unknown as LikeRow;
    const id = typedRow.fk_product_id;
    if (!likeCount[id]) {
      likeCount[id] = {
        name: typedRow.products?.product_name ?? "",
        brand: typedRow.products?.brands?.brand_name ?? "",
        count: 0,
      };
    }
    likeCount[id].count++;
  });

  const popularProducts = Object.values(likeCount)
    .sort((a, b) => b.count - a.count) // 좋아요 많은 순 정렬
    .slice(0, 5); // 상위 5개만

  // 데이터만 DashboardLayout에 props로 전달
  return (
    <DashboardLayout
      stats={{
        todayUsers: todayUsers ?? 0,
        totalUsers: totalUsers ?? 0,
        todayPlays: todayPlays ?? 0,
      }}
      chartData={chartData}
      popularProducts={popularProducts}
    />
  );
}
