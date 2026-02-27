// footer
"use client";

import Link from "next/link";
import Image from "next/image";
import logoImage from "../../../public/logo.png";
import githubIcon from "../../../public/github_icon.svg";
import instagramIcon from "../../../public/insta_icon.svg";
import notionIcon from "../../../public/notion_icon.svg";

import { styled } from "@mui/material/styles";

// 클릭시 이동 방지
const handleComingSoon = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  alert("준비중입니다.");
};

export default function Footer() {
  return (
    <FooterWrap>
      <FooterInner>
        {/* 왼쪽 */}

        <LeftWrap>
          {/* 로고 */}
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <Image src={logoImage} alt="KEY-TAP 로고" />
          </Link>

          <OwnerWrap>
            <li>
              <a href="#" onClick={handleComingSoon}>
                황수곤
              </a>
            </li>
            <li>
              <a href="#" onClick={handleComingSoon}>
                안윤희
              </a>
            </li>
            <li>
              <a href="#" onClick={handleComingSoon}>
                양원지
              </a>
            </li>
          </OwnerWrap>

          <CopyWrap>Copyright© 2026 키탭&#40;주&#41; all rights reserved.</CopyWrap>
        </LeftWrap>

        {/* 오른쪽 */}
        <RightWrap>
          <li>
            <a href="#" onClick={handleComingSoon}>
              <Image src={githubIcon} alt="깃허브아이콘" />
            </a>
          </li>
          <li>
            <a href="#" onClick={handleComingSoon}>
              <Image src={notionIcon} alt="노션아이콘" />
            </a>
          </li>
          <li>
            <a href="#" onClick={handleComingSoon}>
              <Image src={instagramIcon} alt="인스타그램아이콘" />
            </a>
          </li>
        </RightWrap>
      </FooterInner>
    </FooterWrap>
  );
}

// 스타일드 컴포넌트
const FooterWrap = styled("footer")(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: "40px 10% 52px",
  boxSizing: "border-box",
}));

const FooterInner = styled("div")(() => ({
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
}));

const LeftWrap = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",

  gap: "24px",

  "& img": {
    maxWidth: "140px",
    width: "100%",
    height: "auto",

    marginBottom: "12px",
  },
}));

const OwnerWrap = styled("ul")(({ theme }) => ({
  display: "flex",
  alignItems: "center",

  gap: 0,

  "& li": {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    paddingRight: "17px",
  },

  "& li + li::before": {
    content: '""',
    display: "block",
    background: "#999",
    width: "1px",
    height: "14px",
    position: "absolute",
    left: "-8px",
    top: "50%",
    transform: "translateY(-50%)",
  },

  "& a": {
    fontSize: "14px",
    fontWeight: 500,
    color: theme.palette.grey[600],
    textDecoration: "none",
  },

  "& a:hover": {
    color: theme.palette.primary.main,
  },
}));

const CopyWrap = styled("div")(({ theme }) => ({
  fontSize: "14px",
  fontWeight: 500,
  color: theme.palette.grey[600],
}));

const RightWrap = styled("ul")(({ theme }) => ({
  display: "flex",
  gap: "24px",
}));
