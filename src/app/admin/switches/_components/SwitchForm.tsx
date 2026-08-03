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
import {
  createSwitchClient,
  updateSwitchClient,
  uploadSoundClient,
} from "@/lib/api/switchesClient";
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
  const [soundFiles, setSoundFiles] = useState<SoundFile[]>([]);
  const [loading, setLoading] = useState(false);

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

        if (soundFiles.length > 0) {
          await Promise.all(
            soundFiles.map((sound) =>
              uploadSoundClient(sound.file, switchData.switch_id, sound.soundType),
            ),
          );
        }
      } else {
        const created = await createSwitchClient({
          switch_name: switchName,
          switch_type: switchType,
          manufacture,
        });

        if (soundFiles.length > 0) {
          await Promise.all(
            soundFiles.map((sound) =>
              uploadSoundClient(sound.file, created.switch_id, sound.soundType),
            ),
          );
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

          <FormTextField
            placeholder="스위치명을 입력해주세요."
            value={switchName}
            onChange={(event) => setSwitchName(event.target.value)}
          />
        </FieldRow>

        <FieldRow>
          <Label>스위치 타입</Label>

          <SwitchFormControl>
            <InputLabel>스위치 타입 불러오기</InputLabel>

            <Select
              value={switchType}
              label="스위치 타입 불러오기"
              onChange={(event) => setSwitchType(event.target.value)}
            >
              <MenuItem value="linear">리니어</MenuItem>
              <MenuItem value="tactile">택타일</MenuItem>
              <MenuItem value="clicky">클리키</MenuItem>
            </Select>
          </SwitchFormControl>
        </FieldRow>

        <FieldRow>
          <Label>제조사</Label>

          <FormTextField
            placeholder="제조사를 입력해주세요."
            value={manufacture}
            onChange={(event) => setManufacture(event.target.value)}
          />
        </FieldRow>
      </Section>

      <Section>
        <SoundTitle variant="h6">스위치 사운드</SoundTitle>

        <SoundUpload soundFiles={soundFiles} onChange={setSoundFiles} />
      </Section>

      <BottomActions>
        <SecondaryActionButton
          type="button"
          variant="outlined"
          onClick={() => router.push("/admin/switches")}
        >
          취소
        </SecondaryActionButton>

        <SecondaryActionButton type="button" variant="outlined">
          임시 저장
        </SecondaryActionButton>

        <PrimaryActionButton
          type="button"
          variant="contained"
          disableElevation
          onClick={handleSubmit}
          disabled={loading}
        >
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
