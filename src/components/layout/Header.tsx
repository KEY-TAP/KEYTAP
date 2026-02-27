// Header
"use client";

import Image from "next/image";
import Link from "next/link";

// mui
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { styled } from "@mui/material/styles";

// 로고
import logoImage from "../../../public/logo.png";
// import Nav from "./Nav";
import { Button } from "@mui/material";

export default function Header() {
  return (
    <HeaderWrap position="sticky" elevation={0}>
      <Containers maxWidth={false}>
        <HeaderInner disableGutters>
          {/* 로고 */}
          <LogoWrap>
            <Link href="/" style={{ display: "flex", alignItems: "center" }}>
              <Image src={logoImage} alt="KEY-TAP 로고" />
            </Link>
          </LogoWrap>

          {/* 네브바 */}
          {/* <Nav /> */}

          {/* 유저 */}

          <UserWrap>
            <ButtonWrap>
              <PersonOutlineIcon />
            </ButtonWrap>
            <Link href="/login" aria-label="로그인">
              <Typography variant="body2">로그인</Typography>
            </Link>
          </UserWrap>
        </HeaderInner>
      </Containers>
    </HeaderWrap>
  );
}

// 스타일드 컴포넌트
const HeaderWrap = styled(AppBar)(({ theme }) => ({
  background: theme.palette.background.default,
  color: theme.palette.text.primary,
  borderBottom: "1px solid #bbb",
}));

const Containers = styled(Container)(() => ({
  width: "90%",
  marginRight: "auto",
  marginLeft: "unset",
}));

const HeaderInner = styled(Toolbar)(() => ({
  height: "80px",
  minHeight: "0 !important",

  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const LogoWrap = styled("div")(() => ({
  minWidth: "200px",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  borderRight: "1px solid #bbb",

  "& img": {
    maxWidth: "140px",
    width: "100%",
    height: "auto",
    objectFit: "cover",
  },
}));

const UserWrap = styled("div")(({ theme }) => ({
  marginLeft: "auto",
  minWidth: "200px",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "25px",

  borderRight: "1px solid #bbb",
  // borderLeft: "1px solid #bbb",

  "& a": {
    transition: "all .3s ease",

    "& p": {
      color: theme.palette.grey[800],
      fontSize: "1.125rem",
      fontWeight: "400",
    },

    "&:hover": {
      "& p": {
        color: theme.palette.primary.main,
      },
    },
  },
}));

const ButtonWrap = styled(Button)(({ theme }) => ({
  transition: "all .3s ease",

  "& svg": {
    fill: theme.palette.grey[900],
  },

  "&:hover": {
    background: "none",

    "& svg": {
      fill: theme.palette.primary.main,
    },
  },
}));
