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
import { createSwitchClient, updateSwitchClient, uploadSoundClient, deleteSoundClient } from "@/lib/api/switchesClient";
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
  switchData?: SwitchData;
}

interface SoundFile {
  file: File;
  soundType: "single" | "long";
}

export default function SwitchForm({ switchData }: Props) {
  const router = useRouter();
  const isEdit = !!switchData;

  const [switchName, setSwitchName] = useState(switchData?.switch_name ?? "");
  const [switchType, setSwitchType] = useState(switchData?.switch_type ?? "");
  const [manufacture, setManufacture] = useState(switchData?.manufacture ?? "");

  // 새로 추가할 사운드 파일
  const [soundFiles, setSoundFiles] = useState<SoundFile[]>([]);

  // 기존에 DB에 저장된 사운드 목록
  const [existingSounds, setExistingSounds] = useState<Sound[]>(switchData?.sounds ?? []);

  const [loading, setLoading] = useState(false);

  // 기존 사운드 삭제
  const handleDeleteExistingSound = async (sound: Sound) => {
    await deleteSoundClient(sound.sound_id, sound.sound_url);
    setExistingSounds((prev) => prev.filter((s) => s.sound_id !== sound.sound_id));
  };

  const handleSubmit = async () => {
    if (!switchName || !switchType) return;

    setLoading(true);
    try {
      if (isEdit && switchData) {
        await updateSwitchClient(switchData.switch_id, {
          switch_name: switchName,
          switch_type: switchType,
          manufacture,
        });

        // 새로 추가된 사운드만 업로드
        if (soundFiles.length > 0) {
          await Promise.allSettled(soundFiles.map((sound) => uploadSoundClient(sound.file, switchData.switch_id, sound.soundType)));
        }
      } else {
        const created = await createSwitchClient({
          switch_name: switchName,
          switch_type: switchType,
          manufacture,
        });

        if (soundFiles.length > 0) {
          await Promise.allSettled(soundFiles.map((sound) => uploadSoundClient(sound.file, created.switch_id, sound.soundType)));
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
        <SectionTitle variant="h6">스위치 정보</SectionTitle>

        <FieldRow>
          <Label>스위치명</Label>
          <FormTextField placeholder="스위치명을 입력해주세요." value={switchName} onChange={(event) => setSwitchName(event.target.value)} />
        </FieldRow>

        <FieldRow>
          <Label>스위치 타입</Label>
          <SwitchFormControl>
            <InputLabel>스위치 타입 불러오기</InputLabel>
            <Select value={switchType} label="스위치 타입 불러오기" onChange={(event) => setSwitchType(event.target.value)}>
              <MenuItem value="linear">리니어</MenuItem>
              <MenuItem value="tactile">택타일</MenuItem>
              <MenuItem value="clicky">클리키</MenuItem>
            </Select>
          </SwitchFormControl>
        </FieldRow>

        <FieldRow>
          <Label>제조사</Label>
          <FormTextField placeholder="제조사를 입력해주세요." value={manufacture} onChange={(event) => setManufacture(event.target.value)} />
        </FieldRow>
      </Section>

      <Section>
        <SoundTitle variant="h6">스위치 사운드</SoundTitle>

        {/* 기존 사운드 목록 (수정 시에만 표시) */}
        {existingSounds.length > 0 && (
          <ExistingSoundList>
            <ExistingSoundHeader>
              <Typography variant="caption" color="text.secondary">
                등록된 사운드
              </Typography>
            </ExistingSoundHeader>
            {existingSounds.map((sound) => (
              <ExistingSoundRow key={sound.sound_id}>
                <audio controls src={sound.sound_url} style={{ height: 40, width: 300 }} />
                <Typography variant="caption" color="text.secondary">
                  {sound.sound_type === "single" ? "Single" : "Long"}
                </Typography>
                <Button size="small" color="error" variant="outlined" onClick={() => handleDeleteExistingSound(sound)}>
                  삭제
                </Button>
              </ExistingSoundRow>
            ))}
          </ExistingSoundList>
        )}

        {/* 새로 추가할 사운드 */}
        <SoundUpload soundFiles={soundFiles} onChange={setSoundFiles} />
      </Section>

      <BottomActions>
        <SecondaryActionButton type="button" variant="outlined" onClick={() => router.push("/admin/switches")}>
          취소
        </SecondaryActionButton>

        <SecondaryActionButton type="button" variant="outlined">
          임시 저장
        </SecondaryActionButton>

        <PrimaryActionButton type="button" variant="contained" disableElevation onClick={handleSubmit} disabled={loading}>
          {loading ? "등록 중..." : isEdit ? "수정 완료" : "스위치 등록"}
        </PrimaryActionButton>
      </BottomActions>
    </FormWrap>
  );
}

const FormWrap = styled(Box)({});

const Section = styled(Box)({
  marginBottom: "60px",
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: "24px",
  fontSize: "1.25rem",
  fontWeight: 400,
  color: theme.palette.grey[800],
}));

const SoundTitle = styled(Typography)(({ theme }) => ({
  marginBottom: "8px",
  fontSize: "1.25rem",
  fontWeight: 400,
  color: theme.palette.grey[800],
}));

const FieldRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  maxWidth: "800px",
  marginBottom: "16px",
});

const Label = styled(Typography)(({ theme }) => ({
  minWidth: "130px",
  color: theme.palette.text.secondary,
  fontSize: "1rem",
  fontWeight: 400,
}));

const FormTextField = styled(TextField)({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "5px",
  },
});

const SwitchFormControl = styled(FormControl)({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "5px",
  },
});

const ExistingSoundList = styled(Box)(({ theme }) => ({
  marginBottom: "24px",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "8px",
  overflow: "hidden",
}));

const ExistingSoundHeader = styled(Box)(({ theme }) => ({
  padding: "8px 12px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.grey[100],
}));

const ExistingSoundRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 12px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

const BottomActions = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  gap: "10px",
  marginTop: "80px",
  boxSizing: "border-box",
});

const ActionButton = styled(Button)({
  width: "200px",
  height: "56px",
  padding: "16px 20px",
  boxSizing: "border-box",
  borderRadius: "5px",
  fontSize: "1.25rem",
  fontWeight: 400,
  textTransform: "none",
  transition: "all .3s ease",
});

const SecondaryActionButton = styled(ActionButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.grey[800],
  backgroundColor: theme.palette.background.default,
  "&:hover": {
    borderColor: theme.palette.primary.main,
    color: theme.palette.background.default,
    backgroundColor: theme.palette.primary.main,
  },
}));

const PrimaryActionButton = styled(ActionButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.default,
  },
  "&.Mui-disabled": {
    borderColor: theme.palette.grey[300],
    color: theme.palette.common.white,
    backgroundColor: theme.palette.grey[300],
  },
}));
