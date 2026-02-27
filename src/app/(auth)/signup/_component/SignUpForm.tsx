"use client";

import React, { useState } from "react";

// mui
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

// mui-icons
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

export default function SignUpForm() {
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    alert("준비중입니다.");
  };

  const comingSoon = () => alert("준비중입니다.");

  return (
    <Wrap aria-label="회원가입 폼">
      <Title variant="h2">회원가입</Title>

      <Form onSubmit={onSubmit}>
        {/* 아이디 */}
        <Field>
          <Label htmlFor="signup-email">아이디</Label>
          <InputWrap>
            <InputField
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              fullWidth
              placeholder="이메일을 입력해주세요."
              size="small"
            />
          </InputWrap>
        </Field>

        {/* 비밀번호 */}
        <Field>
          <Label htmlFor="signup-password">비밀번호</Label>
          <InputWrap>
            <InputField
              id="signup-password"
              name="password"
              autoComplete="new-password"
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
          </InputWrap>
        </Field>

        {/* 비밀번호 확인 */}
        <Field>
          <Label htmlFor="signup-password2">비밀번호 확인</Label>
          <InputWrap>
            <InputField
              id="signup-password2"
              name="passwordConfirm"
              autoComplete="new-password"
              fullWidth
              placeholder="비밀번호를 다시 한번 입력해주세요."
              size="small"
              type={showPw2 ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPw2 ? "비밀번호 숨기기" : "비밀번호 보기"}
                      onClick={() => setShowPw2((v) => !v)}
                      edge="end"
                    >
                      {showPw2 ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </InputWrap>
        </Field>

        {/* 이름 */}
        <Field>
          <Label htmlFor="signup-name">이름</Label>
          <InputWrap>
            <InputField
              id="signup-name"
              name="name"
              autoComplete="name"
              fullWidth
              placeholder="이름을 입력해주세요."
              size="small"
            />
          </InputWrap>
        </Field>

        {/* 연락처 + 인증하기 */}
        <Field>
          <Label htmlFor="signup-phone">연락처</Label>
          <InputWrap>
            <InputField
              id="signup-phone"
              name="phone"
              autoComplete="tel"
              fullWidth
              placeholder="휴대폰 번호를 인증해주세요."
              size="small"
            />
            <VerifyButton type="button" variant="contained" onClick={comingSoon}>
              인증하기
            </VerifyButton>
          </InputWrap>
        </Field>

        {/* 주소 */}
        <Field>
          <Label>주소</Label>
          <InputWrap>
            <Row>
              <InputField name="zipcode" fullWidth placeholder="우편번호" size="small" />
              <SearchAddressButton type="button" variant="outlined" onClick={comingSoon}>
                주소검색
              </SearchAddressButton>
            </Row>

            <InputField name="address1" fullWidth placeholder="기본주소" size="small" />

            <InputField name="address2" fullWidth placeholder="나머지 주소" size="small" />
          </InputWrap>
        </Field>

        {/* 약관동의 */}
        <AgreeArea>
          <AgreeLabel as="div">약관동의</AgreeLabel>

          <div>
            <FormControlLabel
              control={<Checkbox name="agreeAll" />}
              label="이용약관 및 개인정보 수집 및 이용, 쇼핑정보 수신에 모두 동의합니다."
            />
            <FormControlLabel
              control={<Checkbox name="agreeTerms" />}
              label="[필수] 이용약관 동의"
            />
            <FormControlLabel
              control={<Checkbox name="agreePrivacy" />}
              label="[필수] 개인정보 수집 및 이용 동의"
            />
            <FormControlLabel
              control={<Checkbox name="agreeMarketing" />}
              label="[선택] 광고정보 수신 동의"
            />
          </div>
        </AgreeArea>

        <SubmitButton type="submit" fullWidth variant="contained">
          <span>가입하기</span>
        </SubmitButton>
      </Form>
    </Wrap>
  );
}

// 스타일드 컴포넌트
const Wrap = styled(Box)(({ theme }) => ({
  maxWidth: "565px",
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
  marginBottom: "25px",

  display: "flex",
  alignItems: "center",
}));

const Label = styled("label")(({ theme }) => ({
  width: "125px",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: 500,
  letterSpacing: "0",
  color: theme.palette.grey[800],
}));

const InputWrap = styled("div")(() => ({
  width: "calc(100% - 125px)",
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
}));

const Row = styled("div")(() => ({
  display: "flex",
  //   flexWrap: "wrap",
  gap: "12px",
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

const VerifyButton = styled(Button)(({ theme }) => ({
  width: "148px",
  height: "48px",
  color: theme.palette.grey[600],
  background: theme.palette.secondary.main,
  border: "none",
  borderRadius: "5px",
  boxShadow: "none",
  transition: "color .3s ease",

  "&:hover": {
    boxShadow: "none",

    transition: "color .3s ease",
    background: theme.palette.primary.main,
    color: theme.palette.background.default,
  },
}));

const SearchAddressButton = styled(Button)(({ theme }) => ({
  width: "148px",
  height: "48px",
  borderRadius: "5px",
  border: "1px solid",
  boxShadow: "none",

  "&:hover": {
    boxShadow: "none",

    transition: "color .3s ease",
    background: theme.palette.primary.main,
    color: theme.palette.background.default,
  },
}));

const AgreeArea = styled(Box)(() => ({}));

const AgreeLabel = styled("label")(({ theme }) => ({
  display: "inline-block",
  fontSize: "14px",
  fontWeight: 500,
  letterSpacing: "0",
  color: theme.palette.grey[800],
  textAlign: "left",
  width: "100%",
  marginBottom: "25px",
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  maxWidth: "200px",
  position: "relative",
  overflow: "hidden",
  height: "48px",
  fontSize: "1.125rem",
  fontWeight: 500,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: "5px",
  transition: "color .3s ease",
  boxShadow: "none",
  marginTop: "72px",

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
