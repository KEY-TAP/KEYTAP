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
    <Modal open={open} onClose={handleClose}>
      <ModalBox>
        {/* 모달 헤더 */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            브랜드 등록
          </Typography>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* 입력 필드 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 56 }}>
            브랜드명
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="브랜드명을 입력해주세요."
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            // 엔터 키로도 등록 가능
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </Box>

        {/* 버튼 */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="outlined" onClick={handleClose}>
            취소
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? "등록 중..." : "등록"}
          </Button>
        </Box>
      </ModalBox>
    </Modal>
  );
}

// MUI Modal은 position fixed로 화면 중앙에 띄워야 함
const ModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)", // 정확한 중앙 정렬
  width: 480,
  backgroundColor: theme.palette.background.default,
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
}));
