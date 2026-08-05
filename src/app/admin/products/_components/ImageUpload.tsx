"use client";

import { useRef } from "react";

// mui
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

    // 같은 파일 다시 선택 가능하게 초기화
    e.target.value = "";
  };

  const handleDelete = (index: number) => {
    // 해당 index만 제외하고 새 배열 반환
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <ImageUploadWrap>
      <UploadGuide variant="caption">
        최대 5개까지 등록할 수 있습니다. <br />
        체크 하면 대표이미지로 등록 됩니다. / 권장 사이즈 300 × 300 px, 최대 이미지 사이즈 100kb까지
        가능합니다.
      </UploadGuide>

      <UploadActions>
        <Button
          variant="outlined"
          size="small"
          onClick={() => inputRef.current?.click()}
          disabled={files.length >= 5}
        >
          사진 추가
        </Button>

        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={() => onChange([])}
          disabled={files.length === 0}
        >
          선택 삭제
        </Button>

        {/* accept="image/*"로 이미지 파일만 선택 가능 */}
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleAdd} />
      </UploadActions>

      {files.length > 0 && (
        <ImageList>
          {/* 헤더 행 */}
          <ImageRow>
            <CheckboxHeaderCell />

            <ImageHeaderText>미리보기</ImageHeaderText>

            <ImageHeaderText></ImageHeaderText>

            <MainImageHeaderText>대표 이미지</MainImageHeaderText>
          </ImageRow>

          {files.map((file, index) => (
            <ImageRow key={index}>
              {/* 체크박스 클릭 = 해당 이미지 삭제 */}
              <DeleteCheckbox onChange={() => handleDelete(index)} />

              <PreviewCell>
                {/*
                  URL.createObjectURL
                  = 업로드 전 로컬 미리보기
                */}
                <PreviewImage src={URL.createObjectURL(file)} alt={file.name} />
              </PreviewCell>

              <FileName variant="caption">{file.name}</FileName>

              <MainImageCell>
                <Checkbox />
              </MainImageCell>
            </ImageRow>
          ))}
        </ImageList>
      )}
    </ImageUploadWrap>
  );
}

const ImageUploadWrap = styled(Box)({
  width: "100%",
});

const UploadGuide = styled(Typography)(({ theme }) => ({
  display: "block",
  marginBottom: "20px",
  fontSize: "1rem",
  color: theme.palette.text.secondary,
}));

const UploadActions = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "40px",

  "& Button": {
    width: "120px",
    height: "40px",
    fontSize: "1rem",
    padding: "10px",
    textAlign: "center",
    borderRadius: "5px",
  },
});

const ImageList = styled(Box)({
  width: "100%",
});

const ImageRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 12px",
  borderBottom: "none",
  fontSize: "1rem",
  color: theme.palette.grey[500],

  "&:first-child": {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const CheckboxHeaderCell = styled(Box)({
  flexShrink: 0,
  width: "32px",
});

const ImageHeaderText = styled(Typography)(({ theme }) => ({
  flex: 1,
  color: theme.palette.text.secondary,
}));

const MainImageHeaderText = styled(Typography)(({ theme }) => ({
  flexShrink: 0,
  width: "80px",
  color: theme.palette.text.secondary,
  textAlign: "center",
}));

const DeleteCheckbox = styled(Checkbox)({
  flexShrink: 0,
  width: "32px",
});

const PreviewCell = styled(Box)({
  flex: 1,

  padding: "28px 14px 14px 0",
});

const PreviewImage = styled("img")(({ theme }) => ({
  display: "block",
  width: "125px",
  height: "125px",
  objectFit: "cover",
  aspectRatio: "1/1",
  backgroundColor: theme.palette.grey[100],
}));

const FileName = styled(Typography)(({ theme }) => ({
  flex: 3,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "1rem",
  color: theme.palette.grey[500],
}));

const MainImageCell = styled(Box)({
  display: "flex",
  flexShrink: 0,
  justifyContent: "center",
  width: "80px",
});
