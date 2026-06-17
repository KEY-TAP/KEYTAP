"use client";

import { useRef, useState } from "react";
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

  // 체크된 항목 인덱스 목록 (선택 삭제용)
  const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    // 새 파일은 기본 soundType을 'single'로 설정
    const newFiles: SoundFile[] = selected.map((file) => ({
      file,
      soundType: "single",
    }));
    onChange([...soundFiles, ...newFiles]);
    e.target.value = "";
  };

  // 체크박스 토글
  const handleCheck = (index: number) => {
    setCheckedIndexes(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // 이미 체크됐으면 제거
          : [...prev, index], // 안 체크됐으면 추가
    );
  };

  // 선택된 항목만 삭제
  const handleDeleteSelected = () => {
    onChange(soundFiles.filter((_, i) => !checkedIndexes.includes(i)));
    setCheckedIndexes([]); // 체크 상태 초기화
  };

  // 특정 파일의 soundType 변경
  const handleTypeChange = (index: number, soundType: "single" | "long") => {
    const updated = soundFiles.map((s, i) => (i === index ? { ...s, soundType } : s));
    onChange(updated);
  };

  return (
    <Section>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        사운드
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button variant="outlined" size="small" onClick={() => inputRef.current?.click()}>
          사운드 추가
        </Button>
        {/* 체크된 항목이 있을 때만 버튼 활성화 */}
        <Button variant="outlined" size="small" color="error" disabled={checkedIndexes.length === 0} onClick={handleDeleteSelected}>
          선택 삭제
        </Button>
        {/* .mp3 파일만 선택 가능 */}
        <input ref={inputRef} type="file" accept=".mp3,audio/mpeg" multiple hidden onChange={handleAdd} />
      </Box>

      {soundFiles.length > 0 && (
        <SoundList>
          {/* 헤더 행 */}
          <SoundRow>
            <Box sx={{ width: 32 }} />
            <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
              미리듣기
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ width: 200 }}>
              사운드 유형
            </Typography>
          </SoundRow>

          {soundFiles.map((s, index) => (
            <SoundRow key={index}>
              {/* 체크박스 선택 = 선택 삭제 대상 */}
              <Checkbox size="small" sx={{ width: 32 }} checked={checkedIndexes.includes(index)} onChange={() => handleCheck(index)} />

              <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1 }}>
                {/* 브라우저 기본 오디오 플레이어로 미리듣기 */}
                <audio controls src={URL.createObjectURL(s.file)} style={{ height: 32 }} />
                <Typography variant="caption" color="text.secondary">
                  {s.file.name}
                </Typography>
              </Box>

              {/* 사운드 유형 선택 (single/long) */}
              <FormControl size="small" sx={{ width: 200 }}>
                <Select value={s.soundType} onChange={(e) => handleTypeChange(index, e.target.value as "single" | "long")}>
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="long">Long</MenuItem>
                </Select>
              </FormControl>
            </SoundRow>
          ))}
        </SoundList>
      )}
    </Section>
  );
}

const Section = styled(Box)(({ theme }) => ({
  marginBottom: "32px",
  padding: "24px",
  backgroundColor: theme.palette.background.default,
  borderRadius: "12px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
}));

const SoundList = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "8px",
  overflow: "hidden",
}));

const SoundRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 12px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));
