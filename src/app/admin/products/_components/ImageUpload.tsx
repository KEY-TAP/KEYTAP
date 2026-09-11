"use client";

import { useRef, useState } from "react";

// mui
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import AlertDialog from "@/app/admin/_common/_components/AlertDialog";

// 최대 이미지 용량 (100KB) - 안내 문구와 동일한 기준
const MAX_IMAGE_SIZE = 100 * 1024;

interface Props {
  files: File[];
  onChange: (files: File[]) => void;
  primaryIndex: number | null;
  onPrimaryChange: (index: number | null) => void;
}

export default function ImageUpload({
  files,
  onChange,
  primaryIndex,
  onPrimaryChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [oversizedFileNames, setOversizedFileNames] = useState<string[]>([]);

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);

    const validFiles = selected.filter((file) => file.size <= MAX_IMAGE_SIZE);
    const oversizedFiles = selected.filter(
      (file) => file.size > MAX_IMAGE_SIZE,
    );

    if (validFiles.length > 0) {
      onChange([...files, ...validFiles]);
    }

    if (oversizedFiles.length > 0) {
      setOversizedFileNames(oversizedFiles.map((file) => file.name));
    }

    e.target.value = "";
  };

  const handleDelete = (index: number) => {
    onChange(files.filter((_, i) => i !== index));

    if (primaryIndex === index) {
      onPrimaryChange(null);
    } else if (primaryIndex !== null && primaryIndex > index) {
      onPrimaryChange(primaryIndex - 1);
    }
  };

  const handlePrimaryToggle = (index: number) => {
    onPrimaryChange(primaryIndex === index ? null : index);
  };

  return (
    <>
      <ImageUploadWrap>
        <UploadGuide variant="caption">
          최대 5개까지 등록할 수 있습니다. <br />
          체크 하면 대표이미지로 등록 됩니다. / 권장 사이즈 300 × 300 px, 최대
          이미지 사이즈 100kb까지 가능합니다.
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
            onClick={() => {
              onChange([]);
              onPrimaryChange(null);
            }}
            disabled={files.length === 0}
          >
            선택 삭제
          </Button>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleAdd}
          />
        </UploadActions>

        {files.length > 0 && (
          <ImageList>
            <ImageRow>
              <CheckboxHeaderCell />
              <ImageHeaderText>미리보기</ImageHeaderText>
              <ImageHeaderText></ImageHeaderText>
              <MainImageHeaderText>대표 이미지</MainImageHeaderText>
            </ImageRow>

            {files.map((file, index) => (
              <ImageRow key={index}>
                <DeleteCheckbox onChange={() => handleDelete(index)} />

                <PreviewCell>
                  <PreviewImage
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                  />
                </PreviewCell>

                <FileName variant="caption">{file.name}</FileName>

                <MainImageCell>
                  <Checkbox
                    checked={primaryIndex === index}
                    onChange={() => handlePrimaryToggle(index)}
                  />
                </MainImageCell>
              </ImageRow>
            ))}
          </ImageList>
        )}
      </ImageUploadWrap>

      <AlertDialog
        open={oversizedFileNames.length > 0}
        title="이미지 등록 실패"
        message={`다음 이미지가 최대 용량(100KB)을 초과하여 등록되지 않았습니다.\n\n${oversizedFileNames.join("\n")}`}
        onClose={() => setOversizedFileNames([])}
      />
    </>
  );
}

const ImageUploadWrap = styled(Box)({ width: "100%" });

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

const ImageList = styled(Box)({ width: "100%" });

const ImageRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 12px",
  borderBottom: "none",
  fontSize: "1rem",
  color: theme.palette.grey[500],
  "&:first-child": { borderBottom: `1px solid ${theme.palette.divider}` },
}));

const CheckboxHeaderCell = styled(Box)({ flexShrink: 0, width: "32px" });

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

const DeleteCheckbox = styled(Checkbox)({ flexShrink: 0, width: "32px" });

const PreviewCell = styled(Box)({ flex: 1, padding: "28px 14px 14px 0" });

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
