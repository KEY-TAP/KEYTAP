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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// mui-icons
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

export default function ProfileForm() {
  const [form, setForm] = useState({
    email: "abc1234@gmail.com",
    name: "홍길동",
    phone: "010-1234-5678",
    zipcode: "",
    address1: "",
    address2: "",
    birthYear: "2000",
    birthMonth: "01",
    birthDay: "01",
    gender: "여",
  });

  const [agreements, setAgreements] = useState({
    agreeAll: true,
    agreeTerms: true,
    agreePrivacy: true,
    agreeMarketing: true,
  });

  const years = Array.from({ length: 60 }, (_, index) => String(2025 - index));
  const months = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));
  const days = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, "0"));

  const handleChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };

  const handleSelectChange = (key: keyof typeof form) => (value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAgreeAllChange = (checked: boolean) => {
    setAgreements({
      agreeAll: checked,
      agreeTerms: checked,
      agreePrivacy: checked,
      agreeMarketing: checked,
    });
  };

  const handleAgreeItemChange = (
    name: "agreeTerms" | "agreePrivacy" | "agreeMarketing",
    checked: boolean,
  ) => {
    const nextAgreements = {
      ...agreements,
      [name]: checked,
    };

    const isAllChecked =
      nextAgreements.agreeTerms && nextAgreements.agreePrivacy && nextAgreements.agreeMarketing;

    setAgreements({
      ...nextAgreements,
      agreeAll: isAllChecked,
    });
  };

  const comingSoon = () => {
    alert("준비중입니다.");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("준비중입니다.");
  };

  return (
    <Wrap aria-label="마이페이지 프로필 폼">
      <TitleWrap>
        <TitleBar />
        <TitleText variant="h2">프로필</TitleText>
      </TitleWrap>

      <Form onSubmit={handleSubmit}>
        <Field>
          <Label requiredMark htmlFor="profile-email">
            아이디
          </Label>
          <ValueText id="profile-email">{form.email}</ValueText>
        </Field>

        <Field>
          <Label requiredMark>비밀번호</Label>
          <PasswordSettingButton type="button" onClick={comingSoon}>
            <span>비밀번호 설정</span>
            <KeyboardArrowDownRoundedIcon />
          </PasswordSettingButton>
        </Field>

        <Field>
          <Label requiredMark htmlFor="profile-name">
            이름
          </Label>
          <InputWrap>
            <InputField
              id="profile-name"
              name="name"
              fullWidth
              placeholder="이름"
              size="small"
              value={form.name}
              onChange={handleChange("name")}
            />
          </InputWrap>
        </Field>

        <Field>
          <Label htmlFor="profile-phone">연락처</Label>
          <InputWrap>
            <Row>
              <InputField
                id="profile-phone"
                name="phone"
                fullWidth
                placeholder="연락처"
                size="small"
                value={form.phone}
                onChange={handleChange("phone")}
              />
              <ActionButton type="button" variant="contained" onClick={comingSoon}>
                변경하기
              </ActionButton>
            </Row>
          </InputWrap>
        </Field>

        <Field alignStart>
          <Label>주소</Label>
          <InputWrap>
            <Row>
              <HalfInputField
                name="zipcode"
                placeholder="우편번호"
                size="small"
                value={form.zipcode}
                onChange={handleChange("zipcode")}
              />
              <SearchAddressButton type="button" variant="outlined" onClick={comingSoon}>
                주소검색
              </SearchAddressButton>
            </Row>

            <InputField
              name="address1"
              fullWidth
              placeholder="기본주소"
              size="small"
              value={form.address1}
              onChange={handleChange("address1")}
            />

            <InputField
              name="address2"
              fullWidth
              placeholder="나머지 주소"
              size="small"
              value={form.address2}
              onChange={handleChange("address2")}
            />
          </InputWrap>
        </Field>

        <SectionDivider />

        <Field>
          <Label>생일</Label>
          <BirthRow>
            <BirthSelect
              value={form.birthYear}
              onChange={(e) => handleSelectChange("birthYear")(e.target.value as string)}
              IconComponent={KeyboardArrowDownRoundedIcon}
              displayEmpty
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </BirthSelect>

            <BirthSelect
              value={form.birthMonth}
              onChange={(e) => handleSelectChange("birthMonth")(e.target.value as string)}
              IconComponent={KeyboardArrowDownRoundedIcon}
              displayEmpty
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </BirthSelect>

            <BirthSelect
              value={form.birthDay}
              onChange={(e) => handleSelectChange("birthDay")(e.target.value as string)}
              IconComponent={KeyboardArrowDownRoundedIcon}
              displayEmpty
            >
              {days.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </BirthSelect>
          </BirthRow>
        </Field>

        <Field>
          <Label>성별</Label>
          <GenderWrap>
            <StyledRadioGroup
              row
              name="gender"
              value={form.gender}
              onChange={(e) => handleSelectChange("gender")(e.target.value)}
            >
              <StyledGenderLabel
                value="남"
                control={<Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />}
                label="남"
              />
              <StyledGenderLabel
                value="여"
                control={<Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />}
                label="여"
              />
            </StyledRadioGroup>
          </GenderWrap>
        </Field>

        <AgreeArea>
          <AgreeLabel>약관동의</AgreeLabel>

          <AgreeCheckbox>
            <StyledFormControlLabel
              isAll
              checked={agreements.agreeAll}
              control={
                <Checkbox
                  icon={<CircleIcon />}
                  checkedIcon={<CircleCheckedIcon />}
                  name="agreeAll"
                  checked={agreements.agreeAll}
                  onChange={(e) => handleAgreeAllChange(e.target.checked)}
                />
              }
              label="이용약관 및 개인정보 수집 및 이용, 쇼핑정보 수신에 모두 동의합니다."
            />
            <StyledFormControlLabel
              checked={agreements.agreeTerms}
              control={
                <Checkbox
                  icon={<CircleIcon />}
                  checkedIcon={<CircleCheckedIcon />}
                  name="agreeTerms"
                  checked={agreements.agreeTerms}
                  onChange={(e) => handleAgreeItemChange("agreeTerms", e.target.checked)}
                />
              }
              label="[필수] 이용약관 동의"
            />
            <StyledFormControlLabel
              checked={agreements.agreePrivacy}
              control={
                <Checkbox
                  icon={<CircleIcon />}
                  checkedIcon={<CircleCheckedIcon />}
                  name="agreePrivacy"
                  checked={agreements.agreePrivacy}
                  onChange={(e) => handleAgreeItemChange("agreePrivacy", e.target.checked)}
                />
              }
              label="[필수] 개인정보 수집 및 이용 동의"
            />
            <StyledFormControlLabel
              checked={agreements.agreeMarketing}
              control={
                <Checkbox
                  icon={<CircleIcon />}
                  checkedIcon={<CircleCheckedIcon />}
                  name="agreeMarketing"
                  checked={agreements.agreeMarketing}
                  onChange={(e) => handleAgreeItemChange("agreeMarketing", e.target.checked)}
                />
              }
              label="[선택] 광고정보 수신 동의"
            />
          </AgreeCheckbox>
        </AgreeArea>

        <BottomRow>
          <WithdrawButton type="button" onClick={comingSoon}>
            회원탈퇴
          </WithdrawButton>
        </BottomRow>

        <SubmitButton type="submit" fullWidth variant="contained">
          정보수정
        </SubmitButton>
      </Form>
    </Wrap>
  );
}

// 스타일드 컴포넌트
const Wrap = styled(Box)(({ theme }) => ({
  width: "100%",
  margin: "0 auto 180px",

  [theme.breakpoints.down("md")]: {
    margin: "0 auto 140px",
  },

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    margin: "0 auto 100px",
  },
}));

const TitleWrap = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "14px",

  [theme.breakpoints.down("md")]: {
    gap: "11px",
  },

  [theme.breakpoints.down("sm")]: {
    gap: "8px",
  },
}));

const TitleBar = styled("span")(({ theme }) => ({
  display: "inline-block",
  width: "3px",
  height: "24px",
  backgroundColor: theme.palette.primary.main,

  [theme.breakpoints.down("md")]: {
    height: "20px",
  },

  [theme.breakpoints.down("sm")]: {
    width: "2px",
    height: "16px",
  },
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 500,
  lineHeight: 1,
  letterSpacing: "-0.04em",
  color: "#000000",

  [theme.breakpoints.down("md")]: {
    fontSize: "1.2rem",
  },

  [theme.breakpoints.down("sm")]: {
    fontSize: "1.0rem",
  },
}));

const Form = styled("form")(({ theme }) => ({
  display: "block",
  marginTop: "32px",

  [theme.breakpoints.down("sm")]: {
    marginTop: "24px",
  },
}));

const Field = styled(Box, {
  shouldForwardProp: (prop) => prop !== "alignStart",
})<{ alignStart?: boolean }>(({ alignStart, theme }) => ({
  textAlign: "left",
  marginBottom: "24px",
  display: "flex",
  alignItems: alignStart ? "flex-start" : "flex-start",

  [theme.breakpoints.down("md")]: {
    marginBottom: "20px",
  },

  [theme.breakpoints.down("sm")]: {
    gap: "12px",
    flexDirection: "column",
  },
}));

const Label = styled("label", {
  shouldForwardProp: (prop) => prop !== "requiredMark",
})<{ requiredMark?: boolean }>(({ theme, requiredMark }) => ({
  width: "132px",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  fontWeight: 700,
  letterSpacing: "0",
  color: theme.palette.grey[800],

  ...(requiredMark && {
    "&::before": {
      content: '""',
      display: "inline-block",
      width: "8px",
      height: "8px",
      borderRadius: "100%",
      backgroundColor: "#FF4B4B",

      [theme.breakpoints.down("md")]: {},

      [theme.breakpoints.down("sm")]: {
        width: "5px",
        height: "5px",
      },
    },
  }),
}));

const ValueText = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: 400,
  color: theme.palette.grey[600],
}));

const InputWrap = styled("div")(({ theme }) => ({
  maxWidth: "440px",
  width: "calc(100% - 132px)",
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",

  [theme.breakpoints.down("md")]: {
    maxWidth: "100%",
    width: "100%",
  },

  [theme.breakpoints.down("sm")]: {},
}));

const Row = styled("div")(() => ({
  width: "100%",
  display: "flex",
  gap: "12px",
}));

const InputField = styled(TextField)(({ theme }) => ({
  maxWidth: "440px",

  "& .MuiOutlinedInput-input": {
    height: "48px",
    padding: "15px 20px",
    boxSizing: "border-box",

    "&::placeholder": {
      color: "#999999",
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

  [theme.breakpoints.down("md")]: {
    maxWidth: "100%",
    width: "100%",

    "& .MuiOutlinedInput-input": {
      height: "42px",
      padding: "15px",
    },
  },

  [theme.breakpoints.down("sm")]: {
    "& .MuiOutlinedInput-input": {
      height: "38px",
    },
  },
}));

const HalfInputField = styled(InputField)(() => ({
  maxWidth: "170px",
}));

const PasswordSettingButton = styled("button")(({ theme }) => ({
  width: "156px",
  height: "48px",
  border: "none",
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
  padding: "0 8px 0 18px",
  background: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  color: theme.palette.grey[600],
  fontSize: "14px",
  fontWeight: 400,

  "& svg": {
    fontSize: "20px",
    color: theme.palette.grey[600],
  },

  [theme.breakpoints.down("md")]: {
    height: "42px",
  },

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    height: "38px",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  width: "148px",
  height: "48px",
  color: theme.palette.grey[600],
  background: theme.palette.secondary.main,
  border: "none",
  borderRadius: "5px",
  boxShadow: "none",
  transition: "all .3s ease",

  "&:hover": {
    boxShadow: "none",
    background: theme.palette.primary.main,
    color: theme.palette.background.default,
  },

  [theme.breakpoints.down("md")]: {
    height: "42px",
  },

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    height: "38px",
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
    background: theme.palette.primary.main,
    color: theme.palette.background.default,
  },

  [theme.breakpoints.down("md")]: {
    width: "130px",
    height: "42px",
  },

  [theme.breakpoints.down("sm")]: {
    width: "100px",
    height: "38px",
  },
}));

const SectionDivider = styled(Box)(({ theme }) => ({
  width: "calc(100% + 80px)",
  height: "1px",
  backgroundColor: theme.palette.grey[100],
  margin: "30px 0 28px -40px",
}));

const BirthRow = styled("div")(({ theme }) => ({
  display: "flex",
  gap: "12px",
  maxWidth: "440px",
  width: "100%",

  [theme.breakpoints.down("md")]: {},

  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
    width: "100%",
    gap: "8px",
  },
}));

const BirthSelect = styled(Select)(({ theme }) => ({
  width: "33%",
  height: "48px",
  borderRadius: "5px",
  backgroundColor: theme.palette.common.white,
  fontSize: "14px",
  color: theme.palette.grey[600],

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.grey[100],
  },

  "& .MuiSelect-select": {
    padding: "12px 40px 12px 18px",
  },

  "& .MuiSvgIcon-root": {
    fontSize: "1.375rem",
    color: theme.palette.grey[600],
    right: "10px",
  },

  [theme.breakpoints.down("md")]: {
    height: "42px",
  },

  [theme.breakpoints.down("sm")]: {
    height: "38px",

    "& .MuiSvgIcon-root": {
      fontSize: "16px",
    },
  },
}));

const GenderWrap = styled(Box)(() => ({
  width: "calc(100% - 132px)",
}));

const StyledRadioGroup = styled(RadioGroup)(({ theme }) => ({
  gap: "24px",

  [theme.breakpoints.down("md")]: {
    gap: "20px",
  },

  [theme.breakpoints.down("sm")]: {
    gap: "16px",
  },
}));

const StyledGenderLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: "0px",

  "& .MuiFormControlLabel-label": {
    fontSize: "14px",
    color: theme.palette.grey[600],
  },
}));

const RadioIcon = styled("span")(({ theme }) => ({
  width: "16px",
  height: "16px",
  borderRadius: "100%",
  border: `1px solid ${theme.palette.grey[300]}`,
  display: "inline-block",
  boxSizing: "border-box",

  [theme.breakpoints.down("md")]: {
    width: "12px",
    height: "12px",
  },

  [theme.breakpoints.down("sm")]: {},
}));

const RadioCheckedIcon = styled("span")(({ theme }) => ({
  width: "16px",
  height: "16px",
  borderRadius: "100%",
  border: `1px solid ${theme.palette.primary.main}`,
  background: theme.palette.common.white,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",

  "&::after": {
    content: '""',
    width: "10px",
    height: "10px",
    borderRadius: "100%",
    backgroundColor: theme.palette.primary.main,
  },

  [theme.breakpoints.down("md")]: {
    width: "12px",
    height: "12px",

    "&::after": {
      width: "8px",
      height: "8px",
    },
  },

  [theme.breakpoints.down("sm")]: {},
}));

const AgreeArea = styled(Box)(({ theme }) => ({
  marginTop: "40px",

  display: "flex",
  flexDirection: "column",
  gap: "25px",

  [theme.breakpoints.down("md")]: {
    marginTop: "30px",
    gap: "20px",
  },

  [theme.breakpoints.down("sm")]: {
    marginTop: "20px",
    gap: "15px",
  },
}));

const AgreeLabel = styled("label")(({ theme }) => ({
  display: "inline-block",
  fontSize: "1rem",
  fontWeight: 700,
  letterSpacing: "0",
  color: theme.palette.grey[700],
  textAlign: "left",
  width: "132px",
  verticalAlign: "top",
}));

const AgreeCheckbox = styled("div")(() => ({
  display: "inline-flex",
  flexDirection: "column",
  gap: "15px",
  width: "calc(100% - 132px)",
  verticalAlign: "top",

  "& label span:first-of-type": {
    borderRadius: "100%",
  },
}));

const StyledFormControlLabel = styled(FormControlLabel, {
  shouldForwardProp: (prop) => prop !== "checked" && prop !== "isAll",
})<{ checked?: boolean; isAll?: boolean }>(({ theme, checked, isAll }) => ({
  margin: "0px",

  "& .MuiFormControlLabel-label": {
    color: checked
      ? theme.palette.primary.main
      : isAll
        ? theme.palette.grey[700]
        : theme.palette.grey[500],
    textAlign: "left",
    fontSize: "1rem",
    transition: "all .3s ease",
  },
}));

// 체크박스 아이콘
const CircleIcon = styled("span")(({ theme }) => ({
  width: "24px",
  height: "24px",
  borderRadius: "100%",
  border: "1px solid #E9E9E9",
  display: "inline-block",
  boxSizing: "border-box",

  [theme.breakpoints.down("md")]: {
    width: "20px",
    height: "20px",
  },

  [theme.breakpoints.down("sm")]: {
    width: "16px",
    height: "16px",
  },
}));

const CircleCheckedIcon = styled("span")(({ theme }) => ({
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  border: `1px solid ${theme.palette.primary.main}`,
  background: theme.palette.primary.main,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",

  "&::after": {
    content: '""',
    width: "8px",
    height: "8px",
    border: "2px solid white",
    borderTop: "none",
    borderLeft: "none",
    transform: "rotate(45deg) translate(-1px, -1px)",
  },

  [theme.breakpoints.down("md")]: {
    width: "20px",
    height: "20px",
  },

  [theme.breakpoints.down("sm")]: {
    width: "16px",
    height: "16px",
  },
}));

const BottomRow = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "24px",

  [theme.breakpoints.down("md")]: {
    marginTop: "20px",
  },

  [theme.breakpoints.down("sm")]: {
    marginTop: "16px",
  },
}));

const WithdrawButton = styled("button")(({ theme }) => ({
  border: "none",
  padding: "0px",
  background: "transparent",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 400,
  color: theme.palette.grey[600],
  textDecoration: "underline",
  textUnderlineOffset: "2px",
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
  transition: "all .3s ease",
  boxShadow: "none",
  marginTop: "28px",
  display: "flex",
  justifyContent: "center",
  margin: "0 auto",

  "&:hover": {
    boxShadow: "none !important",
    color: theme.palette.primary.main,
    background: theme.palette.background.default,
  },

  [theme.breakpoints.down("md")]: {
    height: "42px",
    marginTop: "24px",
  },

  [theme.breakpoints.down("sm")]: {
    height: "38px",
    marginTop: "20px",
  },
}));
