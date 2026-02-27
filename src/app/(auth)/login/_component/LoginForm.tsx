"use client";

import { useState } from "react";

// mui
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

// mui-icons
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

export default function LoginForm() {
  const [showPw, setShowPw] = useState(false);

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    alert("준비중입니다.");
  };

  const comingSoon = () => alert("준비중입니다.");

  return (
    <Wrap aria-label="로그인 폼">
      <Title variant="h2">로그인</Title>

      <Form onSubmit={onSubmit}>
        {/* 이메일 */}
        <Field>
          <Label htmlFor="login-email">ID</Label>
          <InputField
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            fullWidth
            placeholder="이메일을 입력해주세요."
            size="small"
          />
        </Field>

        {/* 비밀번호 */}
        <Field>
          <Label htmlFor="login-password">PASSWORD</Label>
          <InputField
            id="login-password"
            name="password"
            autoComplete="current-password"
            fullWidth
            placeholder="비밀번호를 입력해주세요."
            size="small"
            type={showPw ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
                    onClick={() => setShowPw((v) => !v)}
                    edge="end"
                  >
                    {showPw ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <ForgotPassword type="button" onClick={comingSoon}>
            비밀번호를 잊으셨나요?
          </ForgotPassword>
        </Field>

        <LoginButton type="submit" fullWidth variant="contained" color="primary">
          <span>로그인</span>
        </LoginButton>

        <SignUpButton
          type="button"
          onClick={comingSoon}
          fullWidth
          variant="outlined"
          color="inherit"
        >
          <span>회원가입</span>
        </SignUpButton>

        <SignUpWithGoogle
          type="button"
          onClick={comingSoon}
          fullWidth
          variant="outlined"
          color="inherit"
        >
          구글로 회원가입하기
        </SignUpWithGoogle>
      </Form>
    </Wrap>
  );
}

// 스타일드 컴포넌트

const Wrap = styled(Box)(({ theme }) => ({
  maxWidth: "440px",
  width: "100%",
  margin: "0 auto 180px",
  textAlign: "center",

  [theme.breakpoints.down("md")]: {
    margin: "0 auto 140px",
  },

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    margin: "0 auto 100px",
  },
}));

const Form = styled("form")(() => ({
  display: "block",
}));

const Title = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: "2rem",
  marginBottom: "40px",
}));

const Field = styled(Box)(() => ({
  textAlign: "left",
  marginBottom: "44px",
}));

const Label = styled("label")(({ theme }) => ({
  display: "inline-block",
  fontSize: "14px",
  fontWeight: 500,
  letterSpacing: "0",
  color: theme.palette.grey[800],
  marginBottom: "12px",
}));

const InputField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-input": {
    height: "48px",
    padding: "15px 20px",
    boxSizing: "border-box",

    "&::placeholder": {
      color: "#999",
      opacity: 1,
      fontSize: "1rem",
    },
  },

  "& .MuiOutlinedInput-notchedOutline": {
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: "5px",

    transition: "all .3s ease",
  },

  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    border: `1px solid ${theme.palette.primary.main}`,
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: `1px solid ${theme.palette.primary.main}`,
  },
}));

const ForgotPassword = styled("button")(({ theme }) => ({
  marginTop: "16px",
  padding: 0,
  border: 0,
  background: "transparent",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: 500,
  color: theme.palette.text.secondary,
  transition: "all .3s ease",

  "&:hover": {
    color: theme.palette.primary.main,
  },

  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 4,
    borderRadius: 8,
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  height: "48px",
  fontSize: "1.125rem",
  fontWeight: 500,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: "5px",

  transition: "color .3s ease",
  boxShadow: "none",

  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: theme.palette.background.default,
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform .4s ease",
    zIndex: 0,
  },

  "& span": {
    position: "relative",
    zIndex: 1,
    transition: "all .3s ease",
  },

  "&:hover": {
    boxShadow: "none !important",
  },

  "&:hover span": {
    color: theme.palette.primary.main,
  },

  "&:hover::before": {
    transform: "scaleX(1)",
  },
}));

const SignUpButton = styled(Button)(({ theme }) => ({
  position: "relative",
  marginTop: "16px",
  overflow: "hidden",
  height: "48px",
  fontSize: "1.125rem",
  fontWeight: 500,
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: "5px",

  transition: "color .3s ease",
  boxShadow: "none",

  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: theme.palette.primary.main,
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform .4s ease",
    zIndex: 0,
  },

  "& span": {
    position: "relative",
    zIndex: 1,
    transition: "all .3s ease",
    color: theme.palette.grey[600],
  },

  "&:hover": {
    boxShadow: "none !important",
  },

  "&:hover span": {
    color: theme.palette.background.default,
  },

  "&:hover::before": {
    transform: "scaleX(1)",
  },
}));

const SignUpWithGoogle = styled(Button)(({ theme }) => ({
  marginTop: "16px",
  height: "48px",
  fontSize: "1.125rem",
  fontWeight: 500,
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: "5px",

  transition: "color .3s ease",
  boxShadow: "none",
  color: theme.palette.grey[600],

  "&:hover": {
    boxShadow: "none",

    transition: "color .3s ease",
    background: theme.palette.primary.main,
    color: theme.palette.background.default,
  },
}));
