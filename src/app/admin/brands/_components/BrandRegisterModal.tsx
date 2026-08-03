"use client";

import { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { createBrandClient } from "@/lib/api/brandsClient";

interface Props {
  open: boolean; // BrandTable에서 내려주는 모달 열림 상태
  onClose: () => void; // 모달 닫기 함수
  onSuccess: () => void; // 등록 완료 후 콜백 (목록 새로고침용)
}

export default function BrandRegisterModal({ open, onClose, onSuccess }: Props) {
  const [brandName, setBrandName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!brandName.trim()) return; // 공백만 있으면 실행 안 함

    setLoading(true);
    try {
      await createBrandClient(brandName.trim());
      setBrandName(""); // 입력값 초기화
      onSuccess(); // 부모에게 등록 완료 알림
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setBrandName(""); // 닫을 때 입력값 초기화
    onClose();
  };

  return (
    /*
      MUI Modal 컴포넌트
      open: true면 모달 표시, false면 숨김
      onClose: 모달 바깥 클릭하거나 ESC 누르면 닫힘
    */
    <ModalContent open={open} onClose={handleClose}>
      <ModalBox>
        {/* 모달 헤더 */}
        <ModalHeader>
          <ModalTitle>브랜드 등록</ModalTitle>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </ModalHeader>

        {/* 입력 필드 */}
        <ModalInputField>
          <ModalInputLabel>브랜드명</ModalInputLabel>
          <ModalInput
            fullWidth
            placeholder="브랜드명을 입력해주세요."
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            // 엔터 키로도 등록 가능
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </ModalInputField>

        {/* 버튼 */}
        <ButtonWrap>
          <Button variant="outlined" onClick={handleClose}>
            취소
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? "등록 중..." : "등록"}
          </Button>
        </ButtonWrap>
      </ModalBox>
    </ModalContent>
  );
}

const ModalContent = styled(Modal)({
  backgroundColor: "rgba(0, 0, 0, 0.66)",
});

const ModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  backgroundColor: theme.palette.background.paper,
  borderRadius: "10px",
  padding: "28px",
  boxSizing: "border-box",
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "46px",

  "& .MuiIconButton-root": {
    color: theme.palette.grey[900],
  },
}));

const ModalTitle = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: 500,
});

const ModalInputField = styled(Box)({
  width: "100%",

  display: "flex",
  alignItems: "center",
  gap: "30px",

  marginBottom: "74px",
});

const ModalInputLabel = styled(Typography)({
  maxWidth: "130px",
  fontSize: "1rem",
  fontWeight: 300,
});

const ModalInput = styled(TextField)({
  width: "calc(100% - 160px)",
  maxWidth: "666px",
  borderRadius: "5px",
});

const ButtonWrap = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",

  "& .MuiButton-root": {
    width: "200px",
    height: "48px",
    padding: "15px",
    boxSizing: "border-box",
    borderRadius: "5px",

    fontSize: "1.125rem",
    fontWeight: 500,
  },
});
