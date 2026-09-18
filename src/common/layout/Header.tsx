// Header
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// supabase
import { supabase } from "@/lib/supabaseClient";

// mui
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

// 로고
import logoImage from "../../../public/logo.png";

// import Nav from "./Nav";

export default function Header() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 로그인 상태 확인
  useEffect(() => {
    const getCurrentSession = async () => {
      const { data } = await supabase.auth.getSession();

      setIsLogin(!!data.session);
    };

    getCurrentSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLogin(!!session);

      if (!session) {
        setIsMenuOpen(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthClick = async () => {
    if (isLogin) {
      const { error } = await supabase.auth.signOut();

      if (error) {
        alert("로그아웃 중 오류가 발생했습니다.");
        return;
      }

      setIsMenuOpen(false);
      router.push("/MainPage");
      return;
    }

    router.push("/LoginPage");
  };

  const handleUserMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

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
            {isLogin && (
              <UserMenuBox>
                <ButtonWrap type="button" onClick={handleUserMenuToggle}>
                  <PersonOutlineIcon />
                </ButtonWrap>

                {isMenuOpen && (
                  <DropdownMenu>
                    <Link href="/MyPage" onClick={() => setIsMenuOpen(false)}>
                      <Typography variant="body1">마이페이지</Typography>
                    </Link>
                    <Link href="/WishListPage" onClick={() => setIsMenuOpen(false)}>
                      <Typography variant="body1">찜목록</Typography>
                    </Link>
                  </DropdownMenu>
                )}
              </UserMenuBox>
            )}

            <ButtonWrap type="button" aria-label={isLogin ? "로그아웃" : "로그인"} onClick={handleAuthClick}>
              <Typography variant="body2">{isLogin ? "로그아웃" : "로그인"}</Typography>
            </ButtonWrap>
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

const Containers = styled(Container)(({ theme }) => ({
  width: "90%",
  marginRight: "auto",
  marginLeft: "unset",

  [theme.breakpoints.down("md")]: {
    margin: "0 auto",
  },

  [theme.breakpoints.down("sm")]: {},
}));

const HeaderInner = styled(Toolbar)(({ theme }) => ({
  height: "80px",
  minHeight: "0 !important",

  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  [theme.breakpoints.down("md")]: {
    height: "72px",
  },

  [theme.breakpoints.down("sm")]: {
    height: "68px",
  },
}));

const LogoWrap = styled("div")(({ theme }) => ({
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

    [theme.breakpoints.down("md")]: {
      maxWidth: "120px",
    },

    [theme.breakpoints.down("sm")]: {
      maxWidth: "100px",
    },
  },

  [theme.breakpoints.down("md")]: {
    minWidth: "160px",
    justifyContent: "flex-start",
  },

  [theme.breakpoints.down("sm")]: {
    minWidth: "120px",
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

  [theme.breakpoints.down("md")]: {
    borderRight: "none",
    minWidth: "0",

    gap: "20px",
  },

  [theme.breakpoints.down("sm")]: {
    gap: "16px",
  },
}));

const ButtonWrap = styled(Button)(({ theme }) => ({
  transition: "all .3s ease",
  minWidth: "unset",
  padding: 0,

  "& svg": {
    fill: theme.palette.grey[900],
  },

  "& p": {
    color: theme.palette.grey[800],
    fontSize: "1.125rem",
    fontWeight: "400",
  },

  "&:hover": {
    background: "none",

    "& svg": {
      fill: theme.palette.primary.main,
    },

    "& p": {
      color: theme.palette.primary.main,
    },
  },
}));

const UserMenuBox = styled("div")(() => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
}));

const DropdownMenu = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "calc(100% + 16px)",
  left: "-50px",
  display: "flex",
  alignItems: "center",
  gap: "53px",
  padding: "13px 32px",
  background: theme.palette.primary.main,
  whiteSpace: "nowrap",
  zIndex: 10,
  borderRadius: "36px",

  "& a": {
    textDecoration: "none",
    textAlign: "center",
    position: "relative",

    "&:first-of-type": {
      "&:after": {
        position: "absolute",
        top: "50%",
        right: "-26px",
        width: "1px",
        height: "19px",
        transform: "translateY(-50%)",
        display: "block",
        content: "''",
        background: theme.palette.background.paper,
      },
    },

    "& p": {
      color: theme.palette.background.default,
      fontSize: "1rem",
      fontWeight: "400",
      transition: "all .3s ease",
    },
  },

  "& a:hover p": {
    fontWeight: "700",
    transition: "all .3s ease",
    color: theme.palette.background.default,
  },

  [theme.breakpoints.down("md")]: {
    left: "unset",
    right: "-310%",
    gap: "43px",
    padding: "13px 26px",

    "& a": {
      "&:first-of-type": {
        "&:after": {
          right: "-21px",
          height: "16px",
        },
      },
    },
  },

  [theme.breakpoints.down("sm")]: {
    gap: "37px",
    padding: "13px 20px",
    top: "calc(100% + 14px)",

    "& a": {
      "&:first-of-type": {
        "&:after": {
          right: "-18px",
          height: "14px",
        },
      },
    },
  },
}));
