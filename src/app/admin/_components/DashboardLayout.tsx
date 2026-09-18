"use client";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import ChartBox from "./ChartBox";
import Header from "./Header";
import PlayChart from "./PlayChart";
import PopularProducts from "./PopularProducts";
import StatCard from "./StatCard";

interface DashboardStats {
  todayVisitors: number;
  totalUsers: number;
  todaySignups: number;
  todayPlays: number;
}

interface ChartData {
  date: string;
  count: number;
}

interface PopularProduct {
  name: string;
  brand: string;
  count: number;
}

interface DashboardLayoutProps {
  stats: DashboardStats;
  chartData: ChartData[];
  popularProducts: PopularProduct[];
}

export default function DashboardLayout({
  stats,
  chartData,
  popularProducts,
}: DashboardLayoutProps) {
  return (
    <DashboardContainer>
      {/* 헤더 */}
      <Header title="대시보드" />

      <StatCardGrid>
        <StatCard label="오늘 방문자 수" value={stats.todayVisitors} />

        <StatCard
          label="총 유저 수 / 오늘 가입자 수"
          value={stats.totalUsers}
          secondaryValue={stats.todaySignups}
        />

        <StatCard label="오늘 재생 수" value={stats.todayPlays} />
      </StatCardGrid>

      <ChartGrid>
        <ChartBox title="최근 7일 재생 수">
          <PlayChart data={chartData} />
        </ChartBox>

        <ChartBox title="인기 모델">
          <PopularProducts products={popularProducts} />
        </ChartBox>
      </ChartGrid>
    </DashboardContainer>
  );
}

const DashboardContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  minWidth: 0,
  color: theme.palette.text.primary,
}));

const StatCardGrid = styled(Box)(() => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "20px",
  margin: 0,
  marginBottom: "50px",
}));

const ChartGrid = styled(Box)(() => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  alignItems: "stretch",
  gap: "20px",
}));
