// 회원탈퇴 다이얼로그

"use client";

import React from "react";

// mui
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

type WithdrawConfirmDialogProps = {
  open: boolean;
  password: string;
  isPending: boolean;
  onClose: () => void;
  onPasswordChange: (value: string) => void;
  onConfirm: () => void | Promise<void>;
};

export default function WithdrawConfirmDialog({
  open,
  password,
  isPending,
  onClose,
  onPasswordChange,
  onConfirm,
}: WithdrawConfirmDialogProps) {
  const handleClose = () => {
    if (isPending) return;

    onClose();
  };

  const handleConfirm = () => {
    if (isPending) return;

    void onConfirm();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <WithdrawDialogTitle>회원탈퇴</WithdrawDialogTitle>

      <WithdrawDialogContent>
        <WithdrawDialogText>비밀번호를 재확인 후 탈퇴하시겠습니까?</WithdrawDialogText>

        <WithdrawPasswordField
          id="withdraw-password"
          name="withdrawPassword"
          fullWidth
          type="password"
          placeholder="현재 비밀번호"
          size="small"
          autoComplete="current-password"
          value={password}
          disabled={isPending}
          onChange={(e) => onPasswordChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleConfirm();
            }
          }}
        />
      </WithdrawDialogContent>

      <WithdrawDialogActions>
        <DialogCancelButton type="button" onClick={handleClose} disabled={isPending}>
          아니오
        </DialogCancelButton>

        <DialogConfirmButton type="button" onClick={handleConfirm} disabled={isPending}>
          {isPending ? "처리 중..." : "예"}
        </DialogConfirmButton>
      </WithdrawDialogActions>
    </Dialog>
  );
}

const WithdrawDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontSize: "1.125rem",
  fontWeight: 700,
  color: theme.palette.grey[900],
  padding: "24px 24px 12px",
}));

const WithdrawDialogContent = styled(DialogContent)(() => ({
  padding: "12px 24px 8px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
}));

const WithdrawDialogText = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: 400,
  color: theme.palette.grey[700],
  lineHeight: 1.6,
}));

const WithdrawPasswordField = styled(TextField)(({ theme }) => ({
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

const WithdrawDialogActions = styled(DialogActions)(() => ({
  padding: "16px 24px 24px",
  display: "flex",
  justifyContent: "flex-end",
  gap: "8px",
}));

const DialogCancelButton = styled(Button)(({ theme }) => ({
  minWidth: "80px",
  height: "40px",
  borderRadius: "5px",
  border: `1px solid ${theme.palette.grey[200]}`,
  color: theme.palette.grey[700],
  backgroundColor: theme.palette.background.default,
  boxShadow: "none",

  "&:hover": {
    boxShadow: "none",
    backgroundColor: theme.palette.grey[50],
  },
}));

const DialogConfirmButton = styled(Button)(({ theme }) => ({
  minWidth: "80px",
  height: "40px",
  borderRadius: "5px",
  color: "#FFFFFF",
  backgroundColor: theme.palette.primary.main,
  boxShadow: "none",

  "&:hover": {
    boxShadow: "none",
    backgroundColor: theme.palette.primary.dark,
  },

  "&:disabled": {
    color: "#FFFFFF",
    opacity: 0.6,
  },
}));
