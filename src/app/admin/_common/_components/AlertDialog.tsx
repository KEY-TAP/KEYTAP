"use client";

import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

type AlertDialogProps = {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
};

// 공용 알림 다이얼로그 (에러/경고 메세지 표시용)
export default function AlertDialog({
  open,
  title = "알림",
  message,
  onClose,
}: AlertDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <AlertDialogTitle>{title}</AlertDialogTitle>

      <AlertDialogContent>
        <AlertDialogText>{message}</AlertDialogText>
      </AlertDialogContent>

      <AlertDialogActions>
        <ConfirmButton type="button" onClick={onClose}>
          확인
        </ConfirmButton>
      </AlertDialogActions>
    </Dialog>
  );
}

const AlertDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontSize: "1.125rem",
  fontWeight: 700,
  color: theme.palette.grey[900],
  padding: "24px 24px 12px",
}));

const AlertDialogContent = styled(DialogContent)(() => ({
  padding: "12px 24px 8px",
}));

const AlertDialogText = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: 400,
  color: theme.palette.grey[700],
  lineHeight: 1.6,
  whiteSpace: "pre-line",
}));

const AlertDialogActions = styled(DialogActions)(() => ({
  padding: "16px 24px 24px",
  display: "flex",
  justifyContent: "flex-end",
}));

const ConfirmButton = styled(Button)(({ theme }) => ({
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
}));
