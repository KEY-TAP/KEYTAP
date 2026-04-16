"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// schema / hook
import { signUpSchema, type SignUpFormValues } from "@/schemas/auth/signUpSchema";
import { useSignUpMutation } from "@/hooks/auth/useSignUpMutation";

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

type FieldErrors = Partial<Record<keyof SignUpFormValues, string>>;

const initialFormValues: SignUpFormValues = {
  email: "",
  password: "",
  passwordConfirm: "",
  name: "",
  phone: "",
  zipCode: "",
  address1: "",
  address2: "",
  agreeTerms: false,
  agreePrivacy: false,
  agreeMarketing: false,
};

export default function SignUpForm() {
  const router = useRouter();

  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const [formValues, setFormValues] = useState<SignUpFormValues>(initialFormValues);
  const [errors, setErrors] = useState<FieldErrors>({});

  const signUpMutation = useSignUpMutation();

  const agreements = useMemo(
    () => ({
      agreeAll: formValues.agreeTerms && formValues.agreePrivacy && formValues.agreeMarketing,
      agreeTerms: formValues.agreeTerms,
      agreePrivacy: formValues.agreePrivacy,
      agreeMarketing: formValues.agreeMarketing,
    }),
    [formValues.agreeMarketing, formValues.agreePrivacy, formValues.agreeTerms],
  );

  const comingSoon = () => alert("준비중입니다.");

  const handleChange =
    (name: keyof SignUpFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

      const nextValues = {
        ...formValues,
        [name]: value,
      } as SignUpFormValues;

      setFormValues(nextValues);

      validateField(name, nextValues);

      if (name === "password" || name === "passwordConfirm") {
        validateField("passwordConfirm", nextValues);
      }
    };

  const handleAgreeAllChange = (checked: boolean) => {
    const nextValues = {
      ...formValues,
      agreeTerms: checked,
      agreePrivacy: checked,
      agreeMarketing: checked,
    };

    setFormValues(nextValues);

    validateAgreementField("agreeTerms", nextValues);
    validateAgreementField("agreePrivacy", nextValues);
    validateAgreementField("agreeMarketing", nextValues);
  };

  const handleAgreeItemChange = (
    name: "agreeTerms" | "agreePrivacy" | "agreeMarketing",
    checked: boolean,
  ) => {
    const nextValues = {
      ...formValues,
      [name]: checked,
    };

    setFormValues(nextValues);

    validateAgreementField(name, nextValues);
  };

  const validateField = (name: keyof SignUpFormValues, nextValues: SignUpFormValues) => {
    const result = signUpSchema.safeParse(nextValues);

    if (result.success) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        ...(name === "password" ? { passwordConfirm: "" } : {}),
      }));
      return;
    }

    const nextErrors: Partial<Record<keyof SignUpFormValues, string>> = {};

    result.error.issues.forEach((issue) => {
      const fieldName = issue.path[0] as keyof SignUpFormValues | undefined;

      if (!fieldName) return;
      if (nextErrors[fieldName]) return;

      nextErrors[fieldName] = issue.message;
    });

    setErrors((prev) => ({
      ...prev,
      [name]: nextErrors[name] ?? "",
      ...(name === "password" || name === "passwordConfirm"
        ? { passwordConfirm: nextErrors.passwordConfirm ?? "" }
        : {}),
    }));
  };

  const validateAgreementField = (
    name: "agreeTerms" | "agreePrivacy" | "agreeMarketing",
    nextValues: SignUpFormValues,
  ) => {
    const result = signUpSchema.safeParse(nextValues);

    if (result.success) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
      return;
    }

    const nextErrors: Partial<Record<keyof SignUpFormValues, string>> = {};

    result.error.issues.forEach((issue) => {
      const fieldName = issue.path[0] as keyof SignUpFormValues | undefined;

      if (!fieldName) return;
      if (nextErrors[fieldName]) return;

      nextErrors[fieldName] = issue.message;
    });

    setErrors((prev) => ({
      ...prev,
      [name]: nextErrors[name] ?? "",
    }));
  };

  const validateForm = () => {
    const result = signUpSchema.safeParse(formValues);

    if (result.success) {
      setErrors({});
      return true;
    }

    const nextErrors: FieldErrors = {};

    result.error.issues.forEach((issue) => {
      const fieldName = issue.path[0] as keyof SignUpFormValues | undefined;

      if (!fieldName) return;
      if (nextErrors[fieldName]) return;

      nextErrors[fieldName] = issue.message;
    });

    setErrors(nextErrors);
    return false;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    try {
      await signUpMutation.mutateAsync(formValues);
      alert("회원가입이 완료되었습니다.");
      router.push("/MainPage");
    } catch (error) {
      const message = error instanceof Error ? error.message : "회원가입 중 오류가 발생했습니다.";

      alert(message);
    }
  };

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
              value={formValues.email}
              onChange={handleChange("email")}
              error={!!errors.email}
              helperText={errors.email}
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
              value={formValues.password}
              onChange={handleChange("password")}
              error={!!errors.password}
              helperText={errors.password}
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
              value={formValues.passwordConfirm}
              onChange={handleChange("passwordConfirm")}
              error={!!errors.passwordConfirm}
              helperText={errors.passwordConfirm}
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
              value={formValues.name}
              onChange={handleChange("name")}
              error={!!errors.name}
              helperText={errors.name}
            />
          </InputWrap>
        </Field>

        {/* 연락처 + 인증하기 */}
        <Field>
          <Label htmlFor="signup-phone">연락처</Label>
          <InputWrap>
            <Row>
              <InputField
                id="signup-phone"
                name="phone"
                autoComplete="tel"
                fullWidth
                placeholder="휴대폰 번호를 인증해주세요."
                size="small"
                value={formValues.phone}
                onChange={handleChange("phone")}
                error={!!errors.phone}
                helperText={errors.phone}
              />
              <VerifyButton type="button" variant="contained" onClick={comingSoon}>
                인증하기
              </VerifyButton>
            </Row>
          </InputWrap>
        </Field>

        {/* 주소 */}
        <Field>
          <Label>주소</Label>
          <InputWrap>
            <Row>
              <InputField
                name="zipCode"
                fullWidth
                placeholder="우편번호"
                size="small"
                value={formValues.zipCode}
                onChange={handleChange("zipCode")}
                error={!!errors.zipCode}
                helperText={errors.zipCode}
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
              value={formValues.address1}
              onChange={handleChange("address1")}
              error={!!errors.address1}
              helperText={errors.address1}
            />

            <InputField
              name="address2"
              fullWidth
              placeholder="나머지 주소"
              size="small"
              value={formValues.address2}
              onChange={handleChange("address2")}
              error={!!errors.address2}
              helperText={errors.address2}
            />
          </InputWrap>
        </Field>

        {/* 약관동의 */}
        <AgreeArea>
          <AgreeLabel as="div">약관동의</AgreeLabel>

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
            {errors.agreeTerms && <AgreeErrorText>{errors.agreeTerms}</AgreeErrorText>}

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
            {errors.agreePrivacy && <AgreeErrorText>{errors.agreePrivacy}</AgreeErrorText>}

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

        <SubmitButton
          type="submit"
          fullWidth
          variant="contained"
          disabled={signUpMutation.isPending}
        >
          {signUpMutation.isPending ? "가입 중..." : "가입하기"}
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

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "2rem",
  marginBottom: "40px",

  [theme.breakpoints.down("md")]: {
    marginBottom: "30px",
    fontSize: "1.75rem",
  },

  [theme.breakpoints.down("sm")]: {
    marginBottom: "20px",
    fontSize: "1.3rem",
  },
}));

const Field = styled(Box)(({ theme }) => ({
  textAlign: "left",
  marginBottom: "25px",
  display: "flex",
  alignItems: "center",

  [theme.breakpoints.down("md")]: {
    marginBottom: "20px",
  },

  [theme.breakpoints.down("sm")]: {
    gap: "12px",
    flexDirection: "column",
    alignItems: "flex-start",
  },
}));

const Label = styled("label")(({ theme }) => ({
  width: "125px",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: 500,
  letterSpacing: "0",
  color: theme.palette.grey[800],
}));

const InputWrap = styled("div")(({ theme }) => ({
  width: "calc(100% - 125px)",
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",

  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

const Row = styled("div")(({ theme }) => ({
  display: "flex",
  gap: "12px",

  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
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

  "& .MuiFormHelperText-root": {
    marginLeft: 0,
  },

  [theme.breakpoints.down("md")]: {
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

const VerifyButton = styled(Button)(({ theme }) => ({
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
    transition: "all .3s ease",
    background: theme.palette.primary.main,
    color: theme.palette.background.default,
  },

  [theme.breakpoints.down("md")]: {
    height: "42px",
  },

  [theme.breakpoints.down("sm")]: {
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
    transition: "color .3s ease",
    background: theme.palette.primary.main,
    color: theme.palette.background.default,
  },

  [theme.breakpoints.down("md")]: {
    height: "42px",
  },

  [theme.breakpoints.down("sm")]: {
    height: "38px",
  },
}));

const AgreeArea = styled(Box)(() => ({}));

const AgreeLabel = styled("label")(({ theme }) => ({
  display: "inline-block",
  fontSize: "1rem",
  fontWeight: 500,
  letterSpacing: "0",
  color: theme.palette.grey[700],
  textAlign: "left",
  width: "100%",
  marginBottom: "20px",

  [theme.breakpoints.down("sm")]: {
    marginTop: "16px",
  },
}));

const AgreeCheckbox = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "15px",

  "& label span:first-of-type": {
    borderRadius: "100%",
  },
}));

const StyledFormControlLabel = styled(FormControlLabel, {
  shouldForwardProp: (prop) => prop !== "checked" && prop !== "isAll",
})<{ checked?: boolean; isAll?: boolean }>(({ theme, checked, isAll }) => ({
  margin: 0,

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
  border: `1px solid ${theme.palette.grey[100]}`,
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
    marginBottom: "2px",
    borderTop: "none",
    borderLeft: "none",
    transform: "rotate(45deg)",
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

const AgreeErrorText = styled(Typography)(({ theme }) => ({
  marginTop: "-8px",
  fontSize: "0.875rem",
  color: theme.palette.error.main,
  textAlign: "left",
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
  marginTop: "72px",

  "&:hover": {
    boxShadow: "none !important",
    transition: "all .3s ease",
    background: theme.palette.background.default,
    color: theme.palette.primary.main,
  },

  "&.Mui-disabled": {
    color: theme.palette.grey[400],
    background: theme.palette.grey[100],
    borderColor: theme.palette.grey[200],
  },

  [theme.breakpoints.down("md")]: {
    height: "42px",
  },

  [theme.breakpoints.down("sm")]: {
    height: "38px",
  },
}));
