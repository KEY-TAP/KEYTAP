"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { supabase } from "@/lib/supabaseClient";

// schema / hook
import { loginSchema, type LoginFormValues } from "@/schemas/auth/loginSchema";
import { useSignInMutation } from "@/hooks/auth/useSignInMutation";

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
import GoogleIcon from "@/common/icons/googleIcon";

type FieldErrors = Partial<Record<keyof LoginFormValues, string>>;

const initialFormValues: LoginFormValues = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [showPw, setShowPw] = useState(false);
  const [formValues, setFormValues] =
    useState<LoginFormValues>(initialFormValues);
  const [errors, setErrors] = useState<FieldErrors>({});

  const signInMutation = useSignInMutation();

  const comingSoon = () => alert("준비중입니다.");

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });

    if (error) {
      alert("구글 로그인 중 오류가 발생했습니다.");
    }
  };

  const handleChange =
    (name: keyof LoginFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextValues = {
        ...formValues,
        [name]: e.target.value,
      };

      setFormValues(nextValues);
      validateField(name, nextValues);
    };

  const validateField = (
    name: keyof LoginFormValues,
    nextValues: LoginFormValues,
  ) => {
    const result = loginSchema.safeParse(nextValues);

    if (result.success) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
      return;
    }

    const nextErrors: FieldErrors = {};

    result.error.issues.forEach((issue) => {
      const fieldName = issue.path[0] as keyof LoginFormValues | undefined;

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
    const result = loginSchema.safeParse(formValues);

    if (result.success) {
      setErrors({});
      return true;
    }

    const nextErrors: FieldErrors = {};

    result.error.issues.forEach((issue) => {
      const fieldName = issue.path[0] as keyof LoginFormValues | undefined;

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
      await signInMutation.mutateAsync(formValues);

      alert("로그인되었습니다.");
      router.push(
        redirectTo && redirectTo.startsWith("/") ? redirectTo : "/MainPage",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "로그인 중 오류가 발생했습니다.";

      alert(message);
    }
  };

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
            value={formValues.email}
            onChange={handleChange("email")}
            error={!!errors.email}
            helperText={errors.email}
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
                    {showPw ? (
                      <VisibilityOutlinedIcon />
                    ) : (
                      <VisibilityOffOutlinedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <ForgotPassword type="button" onClick={comingSoon}>
            비밀번호를 잊으셨나요?
          </ForgotPassword>
        </Field>

        <LoginButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={signInMutation.isPending}
        >
          <span>{signInMutation.isPending ? "로그인 중..." : "로그인"}</span>
        </LoginButton>

        <SignUpButton
          type="button"
          onClick={() => router.push("/SignUpPage")}
          fullWidth
          variant="outlined"
          color="inherit"
        >
          <span>회원가입</span>
        </SignUpButton>

        <LoginWithGoogle
          type="button"
          onClick={handleGoogleLogin}
          fullWidth
          variant="outlined"
          color="inherit"
        >
          <i>
            <GoogleIcon />
          </i>
          <p>
            <strong>Google</strong> 계정으로 로그인
          </p>
        </LoginWithGoogle>
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

  "& .MuiFormHelperText-root": {
    marginLeft: 0,
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
  marginTop: "16px",
  height: "48px",
  fontSize: "1.125rem",
  fontWeight: 500,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: "5px",
  transition: "all .3s ease",
  boxShadow: "none",
  color: theme.palette.background.default,

  "&:hover": {
    boxShadow: "none",
    transition: "all .3s ease",
    background: theme.palette.background.default,
    color: theme.palette.primary.main,
  },

  "&.Mui-disabled": {
    color: theme.palette.grey[400],
    background: theme.palette.grey[100],
    borderColor: theme.palette.grey[200],
  },
}));

const SignUpButton = styled(Button)(({ theme }) => ({
  marginTop: "16px",
  height: "48px",
  fontSize: "1.125rem",
  fontWeight: 500,
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: "5px",
  transition: "all .3s ease",
  boxShadow: "none",
  color: theme.palette.grey[600],

  "&:hover": {
    boxShadow: "none",
    transition: "all .3s ease",
    background: theme.palette.primary.main,
    color: theme.palette.background.default,
  },
}));

const LoginWithGoogle = styled(Button)(({ theme }) => ({
  marginTop: "16px",
  height: "48px",

  border: `1px solid ${theme.palette.primary.main}`,
  background: theme.palette.primary.main,
  borderRadius: "5px",

  transition: "all .3s ease",
  boxShadow: "none",

  display: "flex",
  gap: "10px",
  alignItems: "center",

  "& i": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "30px",
    height: "30px",
    borderRadius: "100%",
    transition: "all .3s ease",
    background: theme.palette.background.default,

    "& svg": {
      width: "26px",
      height: "26px",
    },
  },

  "& p": {
    fontSize: "1rem",
    color: theme.palette.background.default,
    fontWeight: 400,
    position: "relative",
    transition: "all .3s ease",
    zIndex: "999",
  },

  "&:hover": {
    transition: "all .3s ease",
    border: `1px solid ${theme.palette.grey[200]}`,
    background: theme.palette.background.default,

    "& p": {
      color: theme.palette.primary.main,
      transform: "scale(100%)",
    },
  },
}));
