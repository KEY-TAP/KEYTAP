"use client";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StatCard from "./StatCard";
import PlayChart from "./PlayChart";
import PopularProducts from "./PopularProducts";
import ChartBox from "./ChartBox";

// page.tsx에서 넘겨주는 props 타입 정의
interface Props {
  stats: {
    todayUsers: number;
    totalUsers: number;
    todayPlays: number;
  };
  chartData: { date: string; count: number }[];
  popularProducts: { name: string; brand: string; count: number }[];
}

export default function DashboardLayout({ stats, chartData, popularProducts }: Props) {
  return (
    <Wrapper>
      <Typography variant="h5" fontWeight="bold" mb={4}>
        대시보드
      </Typography>

      {/* 통계 카드 3개 가로 배치 */}
      <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
        <StatCard label="오늘 가입자 수" value={stats.todayUsers} />
        <StatCard label="총 유저 수" value={stats.totalUsers} />
        <StatCard label="오늘 재생 수" value={stats.todayPlays} />
      </Box>

      {/* 차트, 인기제품 가로 배치 */}
      <Box sx={{ display: "flex", gap: 3 }}>
        <ChartBox>
          <Typography variant="body2" color="text.secondary" mb={2}>
            최근 7일 재생 수
          </Typography>
          <PlayChart data={chartData} />
        </ChartBox>

        <ChartBox>
          <Typography variant="body2" color="text.secondary" mb={2}>
            인기 제품
          </Typography>
          <PopularProducts products={popularProducts} />
        </ChartBox>
      </Box>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => ({
  padding: "32px",
}));
