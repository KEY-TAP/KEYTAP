"use client";

import { useTheme } from "@mui/material/styles";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  data: { date: string; count: number }[];
}

export default function PlayChart({ data }: Props) {
  // theme 값을 런타임에 가져옴
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="count" name="재생 수" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
