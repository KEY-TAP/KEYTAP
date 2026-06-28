"use client";

import { useRef } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

interface Props {
  files: File[];
  onChange: (files: File[]) => void;
}

export default function ImageUpload({ files, onChange }: Props) {
  // 숨긴 input을 버튼으로 트리거하기 위한 ref
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    onChange([...files, ...selected]);
    e.target.value = ""; // 같은 파일 다시 선택 가능하게 초기화
  };

  const handleDelete = (index: number) => {
    // 해당 index만 제외하고 새 배열 반환
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
        최대 5개까지 등록할 수 있습니다. / 권장 사이즈 300 × 300 px, 최대 이미지 사이즈 100kb까지 가능합니다.
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button variant="outlined" size="small" onClick={() => inputRef.current?.click()} disabled={files.length >= 5}>
          사진 추가
        </Button>
        <Button variant="outlined" size="small" color="error" onClick={() => onChange([])} disabled={files.length === 0}>
          선택 삭제
        </Button>
        {/* accept="image/*" 로 이미지 파일만 선택 가능 */}
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleAdd} />
      </Box>

      {files.length > 0 && (
        <ImageList>
          {/* 헤더 행 */}
          <ImageRow>
            <Box sx={{ width: 32 }} />
            <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
              미리보기
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
              파일명
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ width: 80, textAlign: "center" }}>
              대표 이미지
            </Typography>
          </ImageRow>

          {files.map((file, index) => (
            <ImageRow key={index}>
              {/* 체크박스 클릭 = 해당 이미지 삭제 */}
              <Checkbox size="small" sx={{ width: 32 }} onChange={() => handleDelete(index)} />

              <Box sx={{ flex: 1 }}>
                {/* URL.createObjectURL = 업로드 전 로컬 미리보기 */}
                <PreviewImage src={URL.createObjectURL(file)} alt={file.name} />
              </Box>

              <Typography variant="caption" sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {file.name}
              </Typography>

              <Box sx={{ width: 80, display: "flex", justifyContent: "center" }}>
                <Checkbox size="small" />
              </Box>
            </ImageRow>
          ))}
        </ImageList>
      )}
    </Box>
  );
}

const ImageList = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "8px",
  overflow: "hidden",
}));

const ImageRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 12px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

const PreviewImage = styled("img")(() => ({
  width: "60px",
  height: "60px",
  objectFit: "cover",
  borderRadius: "4px",
  backgroundColor: "#f0f0f0",
}));
