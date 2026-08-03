import { createClient } from "@/lib/supabaseServer";

import DashboardLayout from "./_components/DashboardLayout";

interface PlayRow {
  played_at: string | null;
}

interface LikeRow {
  fk_product_id: number;
  products: {
    product_name: string;
    brands: {
      brand_name: string;
    } | null;
  } | null;
}

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 한국 시간 기준 오늘 00:00을 UTC Date 객체로 반환
 *
 * 예:
 * 한국 시간 2026-04-22 00:00
 * UTC 시간 2026-04-21 15:00
 */
function getKstTodayStart(now = new Date()) {
  const kstNow = new Date(now.getTime() + KST_OFFSET_MS);

  const todayStartTimestamp =
    Date.UTC(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate()) - KST_OFFSET_MS;

  return new Date(todayStartTimestamp);
}

/**
 * UTC Date 객체를 한국 시간 기준 M/D 형태로 변환
 *
 * 예:
 * 2026-04-21T15:00:00.000Z
 * → 4/22
 */
function getKstDateLabel(date: Date) {
  const kstDate = new Date(date.getTime() + KST_OFFSET_MS);

  const month = kstDate.getUTCMonth() + 1;
  const day = kstDate.getUTCDate();

  return `${month}/${day}`;
}

export default async function AdminHome() {
  const supabase = await createClient();

  /**
   * 한국 시간 기준 조회 범위
   *
   * todayStart: 오늘 00:00
   * tomorrowStart: 내일 00:00
   * sevenDaysStart: 오늘 포함 7일 전 시작 시각
   */
  const todayStart = getKstTodayStart();
  const tomorrowStart = new Date(todayStart.getTime() + ONE_DAY_MS);
  const sevenDaysStart = new Date(todayStart.getTime() - ONE_DAY_MS * 6);

  const todayStartISO = todayStart.toISOString();
  const tomorrowStartISO = tomorrowStart.toISOString();
  const sevenDaysStartISO = sevenDaysStart.toISOString();

  /**
   * 서로 의존하지 않는 Supabase 요청을 병렬로 실행
   */
  const [todaySignupsResult, totalUsersResult, todayPlaysResult, playsResult, popularResult] =
    await Promise.all([
      // 오늘 가입자 수
      supabase
        .from("users")
        .select("*", {
          count: "exact",
          head: true,
        })
        .gte("created_at", todayStartISO)
        .lt("created_at", tomorrowStartISO),

      // 총 유저 수
      supabase.from("users").select("*", {
        count: "exact",
        head: true,
      }),

      // 오늘 재생 수
      supabase
        .from("user_plays")
        .select("*", {
          count: "exact",
          head: true,
        })
        .gte("played_at", todayStartISO)
        .lt("played_at", tomorrowStartISO),

      // 최근 7일 재생 데이터
      supabase
        .from("user_plays")
        .select("played_at")
        .gte("played_at", sevenDaysStartISO)
        .lt("played_at", tomorrowStartISO),

      // 인기 제품
      supabase
        .from("user_product_likes")
        .select("fk_product_id, products(product_name, brands(brand_name))"),
    ]);

  /**
   * Supabase 조회 오류 처리
   */
  const dashboardError =
    todaySignupsResult.error ??
    totalUsersResult.error ??
    todayPlaysResult.error ??
    playsResult.error ??
    popularResult.error;

  if (dashboardError) {
    throw new Error(`대시보드 데이터를 불러오지 못했습니다: ${dashboardError.message}`);
  }

  const todaySignups = todaySignupsResult.count ?? 0;
  const totalUsers = totalUsersResult.count ?? 0;
  const todayPlays = todayPlaysResult.count ?? 0;

  /**
   * 방문 기록 테이블 정보가 없으므로 임시로 0 처리
   *
   * visitor_logs, daily_visitors 등의 방문 기록 테이블이 있다면
   * 실제 count 쿼리로 교체
   */
  const todayVisitors = 0;

  /**
   * 최근 7일 재생 수 집계
   */
  const playsByDate: Record<string, number> = {};

  // 최근 7일 날짜를 먼저 0으로 초기화
  for (let index = 0; index < 7; index += 1) {
    const currentDate = new Date(sevenDaysStart.getTime() + ONE_DAY_MS * index);

    const dateLabel = getKstDateLabel(currentDate);

    playsByDate[dateLabel] = 0;
  }

  // 실제 재생 데이터 집계
  const playRows = (playsResult.data ?? []) as PlayRow[];

  playRows.forEach(({ played_at }) => {
    if (!played_at) {
      return;
    }

    const dateLabel = getKstDateLabel(new Date(played_at));

    if (dateLabel in playsByDate) {
      playsByDate[dateLabel] += 1;
    }
  });

  const chartData = Object.entries(playsByDate).map(([date, count]) => ({
    date,
    count,
  }));

  /**
   * 제품별 좋아요 수 집계
   */
  const likeCount: Record<
    string,
    {
      name: string;
      brand: string;
      count: number;
    }
  > = {};

  const popularRows = (popularResult.data ?? []) as unknown as LikeRow[];

  popularRows.forEach((row) => {
    const productId = String(row.fk_product_id);

    if (!likeCount[productId]) {
      likeCount[productId] = {
        name: row.products?.product_name ?? "",
        brand: row.products?.brands?.brand_name ?? "",
        count: 0,
      };
    }

    likeCount[productId].count += 1;
  });

  const popularProducts = Object.values(likeCount)
    .sort((first, second) => second.count - first.count)
    .slice(0, 5);

  return (
    <DashboardLayout
      stats={{
        todayVisitors,
        totalUsers,
        todaySignups,
        todayPlays,
      }}
      chartData={chartData}
      popularProducts={popularProducts}
    />
  );
}
