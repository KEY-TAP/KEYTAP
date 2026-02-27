// MainLayout

"use client";
import { styled } from "@mui/material/styles";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return <MainWrap>{children}</MainWrap>;
}

const MainWrap = styled("main")(() => ({
  width: "100%",
  margin: "0 auto",
  padding: "52px 10%",
  boxSizing: "border-box",
}));
