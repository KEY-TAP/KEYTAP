"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import { createSwitchClient, updateSwitchClient, uploadSoundClient } from "@/lib/api/switchesClient";
import SoundUpload from "./SoundUpload";

interface Sound {
  sound_id: number;
  sound_url: string;
  sound_type: string;
}

interface SwitchData {
  switch_id: number;
  switch_name: string;
  switch_type: string;
  manufacture: string | null;
  sounds: Sound[] | null;
}

interface Props {
  switchData?: SwitchData; // 없으면 등록 모드, 있으면 수정 모드
}

// 사운드 파일 + 타입을 묶어서 관리하는 타입
interface SoundFile {
  file: File;
  soundType: "single" | "long";
}

export default function SwitchForm({ switchData }: Props) {
  const router = useRouter();
  const isEdit = !!switchData; // switchData 있으면 수정 모드

  // 기존 데이터 있으면 초기값으로 설정, 없으면 빈 값
  const [switchName, setSwitchName] = useState(switchData?.switch_name ?? "");
  const [switchType, setSwitchType] = useState(switchData?.switch_type ?? "");
  const [manufacture, setManufacture] = useState(switchData?.manufacture ?? "");
  const [soundFiles, setSoundFiles] = useState<SoundFile[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!switchName || !switchType) return;

    setLoading(true);
    try {
      if (isEdit && switchData) {
        // 수정 모드: 스위치 정보 업데이트
        await updateSwitchClient(switchData.switch_id, {
          switch_name: switchName,
          switch_type: switchType,
          manufacture,
        });

        // 새로 추가된 사운드 파일 업로드
        if (soundFiles.length > 0) {
          await Promise.all(soundFiles.map((s) => uploadSoundClient(s.file, switchData.switch_id, s.soundType)));
        }
      } else {
        // 등록 모드: 스위치 먼저 등록 후 사운드 업로드
        const created = await createSwitchClient({
          switch_name: switchName,
          switch_type: switchType,
          manufacture,
        });

        if (soundFiles.length > 0) {
          await Promise.all(soundFiles.map((s) => uploadSoundClient(s.file, created.switch_id, s.soundType)));
        }
      }

      router.push("/admin/switches");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrap>
      <Section>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          스위치 정보
        </Typography>

        <FieldRow>
          <Label>스위치명</Label>
          <TextField fullWidth size="small" placeholder="스위치명을 입력해주세요." value={switchName} onChange={(e) => setSwitchName(e.target.value)} />
        </FieldRow>

        <FieldRow>
          <Label>스위치 타입</Label>
          <FormControl fullWidth size="small">
            <InputLabel>스위치 타입 불러오기</InputLabel>
            <Select value={switchType} label="스위치 타입 불러오기" onChange={(e) => setSwitchType(e.target.value)}>
              <MenuItem value="linear">리니어</MenuItem>
              <MenuItem value="tactile">택타일</MenuItem>
              <MenuItem value="clicky">클리키</MenuItem>
            </Select>
          </FormControl>
        </FieldRow>

        <FieldRow>
          <Label>제조사</Label>
          <TextField fullWidth size="small" placeholder="제조사를 입력해주세요." value={manufacture} onChange={(e) => setManufacture(e.target.value)} />
        </FieldRow>
      </Section>

      {/*
        soundFiles: SwitchForm이 가진 사운드 파일 상태
        onChange: SoundUpload에서 파일 변경시 SwitchForm 상태 업데이트
      */}
      <SoundUpload soundFiles={soundFiles} onChange={setSoundFiles} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button variant="outlined" onClick={() => router.push("/admin/switches")}>
          취소
        </Button>
        <Button variant="outlined">임시 저장</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "등록 중..." : isEdit ? "수정 완료" : "스위치 등록"}
        </Button>
      </Box>
    </FormWrap>
  );
}

const FormWrap = styled(Box)(() => ({ maxWidth: 800 }));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: "32px",
  padding: "24px",
  backgroundColor: theme.palette.background.default,
  borderRadius: "12px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
}));

const FieldRow = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "16px",
}));

const Label = styled(Typography)(({ theme }) => ({
  minWidth: "80px",
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
}));
