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
import AlertDialog from "@/app/admin/_common/_components/AlertDialog";

// 최대 사운드 용량 (1MB) - 단타음은 수십 KB, 10초 내외 연속음도 300KB 이하라 충분한 기준
const MAX_SOUND_SIZE = 1024 * 1024;

// mp3 파일인지 확인 (파일 선택 창에서 '모든 파일'로 바꿔 고를 수 있어 확장자로 한 번 더 확인)
const isMp3File = (file: File) => /\.mp3$/i.test(file.name);

interface SoundFile {
  file: File;
  soundType: "single" | "long";
}

interface ExistingSound {
  sound_id: number;
  sound_url: string;
  sound_type: string;
}

interface Props {
  soundFiles: SoundFile[];
  onChange: (soundFiles: SoundFile[]) => void;
  existingSounds?: ExistingSound[];
  onDeleteExisting?: (soundId: number) => void;
}

export default function SoundUpload({ soundFiles, onChange, existingSounds = [], onDeleteExisting }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // 체크된 항목 인덱스 목록
  const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);

  // 등록되지 않은 파일 안내 문구 (형식·용량 기준에 맞지 않는 파일)
  const [rejectedMessage, setRejectedMessage] = useState("");

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);

    const wrongTypeFiles = selected.filter((file) => !isMp3File(file));
    const oversizedFiles = selected.filter((file) => isMp3File(file) && file.size > MAX_SOUND_SIZE);
    const validFiles = selected.filter((file) => isMp3File(file) && file.size <= MAX_SOUND_SIZE);

    if (validFiles.length > 0) {
      const newFiles: SoundFile[] = validFiles.map((file) => ({
        file,
        soundType: "single",
      }));

      onChange([...soundFiles, ...newFiles]);
    }

    const messages: string[] = [];

    if (wrongTypeFiles.length > 0) {
      messages.push(`다음 파일은 MP3 형식이 아니라 등록되지 않았습니다.\n\n${wrongTypeFiles.map((file) => file.name).join("\n")}`);
    }

    if (oversizedFiles.length > 0) {
      messages.push(`다음 사운드가 최대 용량(1MB)을 초과하여 등록되지 않았습니다.\n\n${oversizedFiles.map((file) => file.name).join("\n")}`);
    }

    if (messages.length > 0) {
      setRejectedMessage(messages.join("\n\n"));
    }

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
        MP3 형식의 사운드 파일을 최대 1MB까지 등록할 수 있습니다.
        <br />
        사운드 유형을 Single 또는 Long으로 선택해주세요.
      </UploadGuide>

      {existingSounds.length > 0 && (
        <>
          <ExistingSoundLabel variant="body2">등록된 사운드</ExistingSoundLabel>

          <SoundList>
            {existingSounds.map((sound) => (
              <SoundRow key={sound.sound_id}>
                <PreviewCell>
                  <AudioPlayer controls src={sound.sound_url} />

                  <FileName variant="caption">
                    {sound.sound_type === "long" ? "Long" : "Single"} 사운드
                  </FileName>
                </PreviewCell>

                <ExistingDeleteButton
                  type="button"
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={() => onDeleteExisting?.(sound.sound_id)}
                >
                  삭제
                </ExistingDeleteButton>
              </SoundRow>
            ))}
          </SoundList>
        </>
      )}

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

      {/* 다이얼로그는 화면 위에 따로 띄워지므로 레이아웃에는 영향 없음 */}
      <AlertDialog open={rejectedMessage !== ""} title="사운드 등록 실패" message={rejectedMessage} onClose={() => setRejectedMessage("")} />
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

const ExistingSoundLabel = styled(Typography)(({ theme }) => ({
  marginBottom: "8px",
  color: theme.palette.text.secondary,
}));

const UploadActions = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginTop: "24px",
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

const ExistingDeleteButton = styled(Button)({
  flexShrink: 0,
  width: "80px",
  height: "36px",
  padding: "6px",
  borderRadius: "5px",
  fontSize: "0.9rem",
});
