"use client";

import { useRef, useState } from "react";

// mui
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

interface SoundFile {
  file: File;
  soundType: "single" | "long";
}

interface Props {
  soundFiles: SoundFile[];
  onChange: (soundFiles: SoundFile[]) => void;
}

export default function SoundUpload({ soundFiles, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // 체크된 항목 인덱스 목록
  const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);

    const newFiles: SoundFile[] = selected.map((file) => ({
      file,
      soundType: "single",
    }));

    onChange([...soundFiles, ...newFiles]);

    e.target.value = "";
  };

  const handleCheck = (index: number) => {
    setCheckedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleDeleteSelected = () => {
    onChange(soundFiles.filter((_, index) => !checkedIndexes.includes(index)));

    setCheckedIndexes([]);
  };

  const handleTypeChange = (index: number, soundType: "single" | "long") => {
    const updated = soundFiles.map((sound, i) =>
      i === index
        ? {
            ...sound,
            soundType,
          }
        : sound,
    );

    onChange(updated);
  };

  return (
    <SoundUploadWrap>
      <UploadGuide variant="caption">
        MP3 형식의 사운드 파일을 등록할 수 있습니다.
        <br />
        사운드 유형을 Single 또는 Long으로 선택해주세요.
      </UploadGuide>

      <UploadActions>
        <Button variant="outlined" size="small" onClick={() => inputRef.current?.click()}>
          사운드 추가
        </Button>

        <Button
          variant="outlined"
          size="small"
          color="error"
          disabled={checkedIndexes.length === 0}
          onClick={handleDeleteSelected}
        >
          선택 삭제
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept=".mp3,audio/mpeg"
          multiple
          hidden
          onChange={handleAdd}
        />
      </UploadActions>

      {soundFiles.length > 0 && (
        <SoundList>
          <SoundRow>
            <CheckboxHeaderCell />

            <PreviewHeaderText>미리듣기</PreviewHeaderText>

            <SoundTypeHeaderText>사운드 유형</SoundTypeHeaderText>
          </SoundRow>

          {soundFiles.map((sound, index) => (
            <SoundRow key={index}>
              <DeleteCheckbox
                size="small"
                checked={checkedIndexes.includes(index)}
                onChange={() => handleCheck(index)}
              />

              <PreviewCell>
                <AudioPlayer controls src={URL.createObjectURL(sound.file)} />

                <FileName variant="caption">{sound.file.name}</FileName>
              </PreviewCell>

              <SoundTypeFormControl size="small">
                <Select
                  value={sound.soundType}
                  onChange={(event) =>
                    handleTypeChange(index, event.target.value as "single" | "long")
                  }
                >
                  <MenuItem value="single">Single</MenuItem>

                  <MenuItem value="long">Long</MenuItem>
                </Select>
              </SoundTypeFormControl>
            </SoundRow>
          ))}
        </SoundList>
      )}
    </SoundUploadWrap>
  );
}

const SoundUploadWrap = styled(Box)({
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
    padding: "10px",
    borderRadius: "5px",
    fontSize: "1rem",
    textAlign: "center",
  },
});

const SoundList = styled(Box)({
  width: "100%",
});

const SoundRow = styled(Box)(({ theme }) => ({
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

const PreviewHeaderText = styled(Typography)(({ theme }) => ({
  flex: 1,
  color: theme.palette.text.secondary,
}));

const SoundTypeHeaderText = styled(Typography)(({ theme }) => ({
  flexShrink: 0,
  width: "200px",
  color: theme.palette.text.secondary,
}));

const DeleteCheckbox = styled(Checkbox)({
  flexShrink: 0,
  width: "32px",
});

const PreviewCell = styled(Box)({
  display: "flex",
  flex: 1,
  alignItems: "center",
  gap: "10px",
  minWidth: 0,
  padding: "14px 0",
});

const AudioPlayer = styled("audio")({
  flexShrink: 0,
  width: "300px",
  height: "40px",
});

const FileName = styled(Typography)(({ theme }) => ({
  overflow: "hidden",
  flex: 1,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "1rem",
  color: theme.palette.grey[500],
}));

const SoundTypeFormControl = styled(FormControl)({
  flexShrink: 0,
  width: "200px",

  "& .MuiOutlinedInput-root": {
    borderRadius: "5px",
  },
});
