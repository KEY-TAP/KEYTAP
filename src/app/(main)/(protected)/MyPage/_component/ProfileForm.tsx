"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// schema
import {
  hasPasswordChangeInput,
  profileUpdateSchema,
  withdrawSchema,
} from "@/schemas/auth/signUpSchema";

// hook
import { useMyProfileQuery } from "@/hooks/auth/useMyProfileQuery";
import { useUpdateMyProfileMutation } from "@/hooks/auth/useUpdateMyProfileMutation";
import { useUpdatePasswordMutation } from "@/hooks/auth/useUpdatePasswordMutation";
import { useWithdrawMutation } from "@/hooks/auth/useWithdrawMutation";

// component
import WithdrawConfirmDialog from "./WithdrawConfirmDialog";

// mui
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

type ProfileData = {
  email?: string | null;
  name?: string | null;
  agreeTerms?: boolean | null;
  agreePrivacy?: boolean | null;
  agreeMarketing?: boolean | null;
};

export default function ProfileForm() {
  const { data: profile, isLoading, isError } = useMyProfileQuery();

  if (isLoading) {
    return <Typography>회원 정보를 불러오는 중입니다.</Typography>;
  }

  if (isError || !profile) {
    return <Typography>회원 정보를 불러오지 못했습니다.</Typography>;
  }

  return <ProfileFormContent profile={profile} />;
}

function ProfileFormContent({ profile }: { profile: ProfileData }) {
  const router = useRouter();

  const updateProfileMutation = useUpdateMyProfileMutation();
  const updatePasswordMutation = useUpdatePasswordMutation();
  const withdrawMutation = useWithdrawMutation();

  const [form, setForm] = useState(() => ({
    email: profile.email ?? "",
    name: profile.name ?? "",
  }));

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });

  const [agreements, setAgreements] = useState(() => ({
    agreeAll: Boolean(profile.agreeTerms && profile.agreePrivacy && profile.agreeMarketing),
    agreeTerms: Boolean(profile.agreeTerms),
    agreePrivacy: Boolean(profile.agreePrivacy),
    agreeMarketing: Boolean(profile.agreeMarketing),
  }));

  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState("");

  const isSubmitting =
    updateProfileMutation.isPending ||
    updatePasswordMutation.isPending ||
    withdrawMutation.isPending;

  const handleChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };

  const handlePasswordChange =
    (key: keyof typeof passwordForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPasswordForm((prev) => ({
        ...prev,
        [key]: e.target.value,
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

  const getSubmitErrorMessage = (error: unknown) => {
    const message =
      error instanceof Error ? error.message : "회원 정보 수정 중 오류가 발생했습니다.";

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("current password") || lowerMessage.includes("current_password")) {
      return "현재 비밀번호가 올바르지 않습니다.";
    }

    if (
      lowerMessage.includes("same password") ||
      lowerMessage.includes("different from the old password")
    ) {
      return "이전 비밀번호와 똑같습니다.";
    }

    return message;
  };

  const getWithdrawErrorMessage = (error: unknown) => {
    const message = error instanceof Error ? error.message : "회원탈퇴 중 오류가 발생했습니다.";

    if (message.includes("비밀번호")) {
      return message;
    }

    if (message.includes("로그인")) {
      return message;
    }

    return "회원탈퇴 중 오류가 발생했습니다.";
  };

  const handleOpenWithdrawDialog = () => {
    setWithdrawPassword("");
    setWithdrawDialogOpen(true);
  };

  const handleCloseWithdrawDialog = () => {
    if (withdrawMutation.isPending) return;

    setWithdrawDialogOpen(false);
    setWithdrawPassword("");
  };

  const handleConfirmWithdraw = async () => {
    const parsedResult = withdrawSchema.safeParse({
      password: withdrawPassword,
    });

    if (!parsedResult.success) {
      alert(parsedResult.error.issues[0]?.message ?? "비밀번호를 입력해주세요.");
      return;
    }

    try {
      await withdrawMutation.mutateAsync({
        password: parsedResult.data.password,
      });

      alert("회원탈퇴가 완료되었습니다.");
      router.replace("/MainPage");
      router.refresh();
    } catch (error) {
      alert(getWithdrawErrorMessage(error));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedResult = profileUpdateSchema.safeParse({
      name: form.name,
      currentPassword: passwordForm.currentPassword,
      password: passwordForm.password,
      passwordConfirm: passwordForm.passwordConfirm,
      agreeTerms: agreements.agreeTerms,
      agreePrivacy: agreements.agreePrivacy,
      agreeMarketing: agreements.agreeMarketing,
    });

    if (!parsedResult.success) {
      alert(parsedResult.error.issues[0]?.message ?? "입력값을 확인해주세요.");
      return;
    }

    const values = parsedResult.data;

    const shouldUpdatePassword = hasPasswordChangeInput({
      currentPassword: values.currentPassword,
      password: values.password,
      passwordConfirm: values.passwordConfirm,
    });

    try {
      if (shouldUpdatePassword) {
        await updatePasswordMutation.mutateAsync({
          currentPassword: values.currentPassword,
          password: values.password,
        });
      }

      await updateProfileMutation.mutateAsync({
        name: values.name,
        agreeTerms: values.agreeTerms,
        agreePrivacy: values.agreePrivacy,
        agreeMarketing: values.agreeMarketing,
      });

      setForm((prev) => ({
        ...prev,
        name: values.name,
      }));

      if (shouldUpdatePassword) {
        setPasswordForm({
          currentPassword: "",
          password: "",
          passwordConfirm: "",
        });
      }

      alert(
        shouldUpdatePassword
          ? "회원 정보와 비밀번호가 수정되었습니다."
          : "회원 정보가 수정되었습니다.",
      );
    } catch (error) {
      alert(getSubmitErrorMessage(error));
    }
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

        <Field alignStart>
          <Label htmlFor="profile-current-password">비밀번호</Label>

          <InputWrap>
            <InputField
              id="profile-current-password"
              name="currentPassword"
              fullWidth
              type="password"
              placeholder="현재 비밀번호"
              size="small"
              autoComplete="current-password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange("currentPassword")}
            />

            <InputField
              id="profile-password"
              name="password"
              fullWidth
              type="password"
              placeholder="새 비밀번호"
              size="small"
              autoComplete="new-password"
              value={passwordForm.password}
              onChange={handlePasswordChange("password")}
            />

            <InputField
              id="profile-password-confirm"
              name="passwordConfirm"
              fullWidth
              type="password"
              placeholder="새 비밀번호 확인"
              size="small"
              autoComplete="new-password"
              value={passwordForm.passwordConfirm}
              onChange={handlePasswordChange("passwordConfirm")}
            />
          </InputWrap>
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
          <WithdrawButton type="button" onClick={handleOpenWithdrawDialog} disabled={isSubmitting}>
            회원탈퇴
          </WithdrawButton>
        </BottomRow>

        <SubmitButton type="submit" fullWidth variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "수정 중..." : "정보수정하기"}
        </SubmitButton>
      </Form>

      <WithdrawConfirmDialog
        open={withdrawDialogOpen}
        password={withdrawPassword}
        isPending={withdrawMutation.isPending}
        onClose={handleCloseWithdrawDialog}
        onPasswordChange={setWithdrawPassword}
        onConfirm={handleConfirmWithdraw}
      />
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
    fontSize: "1rem",
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
  alignItems: alignStart ? "flex-start" : "center",

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

  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.5,
  },
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
