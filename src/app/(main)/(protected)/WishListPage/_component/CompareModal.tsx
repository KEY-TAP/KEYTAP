"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PLAY_ICON, PAUSE_ICON } from "@/common/icons/icons";

// mui
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

// mui icons
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export type CompareProduct = {
  id: number;
  title: string;
  imageSrc?: string;
  description?: string | null;
  soundLabel: string;
  soundUrl?: string;
};

type CompareModalProps = {
  open: boolean;
  onClose: () => void;
  items: CompareProduct[];
  options: CompareProduct[];
};

export default function CompareModal({
  open,
  onClose,
  items,
  options,
}: CompareModalProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>(() =>
    items.map((item) => item.id),
  );
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRefs = useRef<Record<number, HTMLAudioElement>>({});

  // 언마운트 시 재생 중인 사운드 정지 (닫힐 때는 handleClose에서 직접 정지)
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((audio) => audio.pause());
    };
  }, []);

  // 모달을 닫을 때 재생 중이던 사운드도 함께 정지
  const handleClose = () => {
    Object.values(audioRefs.current).forEach((audio) => audio.pause());
    audioRefs.current = {};
    setPlayingIndex(null);
    onClose();
  };

  const handleTogglePlay = (index: number, soundUrl?: string) => {
    if (!soundUrl) return;

    // 같은 항목을 다시 누르면 정지
    if (playingIndex === index) {
      audioRefs.current[index]?.pause();
      setPlayingIndex(null);
      return;
    }

    // 다른 항목이 재생 중이었다면 정지 후 전환
    if (playingIndex !== null) {
      audioRefs.current[playingIndex]?.pause();
    }

    const audio = new Audio(soundUrl);
    audio.onended = () => setPlayingIndex(null);
    audioRefs.current[index] = audio;
    audio.play().catch(() => {});
    setPlayingIndex(index);
  };

  const handleChange = (index: number, value: string) => {
    // 선택이 바뀌면 재생 중이던 사운드는 정지
    audioRefs.current[index]?.pause();
    if (playingIndex === index) setPlayingIndex(null);

    const nextIds = [...selectedIds];
    nextIds[index] = Number(value);
    setSelectedIds(nextIds);
  };

  const selectedItems = selectedIds
    .map((id) => options.find((option) => option.id === id))
    .filter(Boolean) as CompareProduct[];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.6)",
        },
      }}
    >
      <Overlay onClick={handleClose}>
        <ModalWrap onClick={(e) => e.stopPropagation()}>
          <CloseButton type="button" onClick={handleClose} aria-label="닫기">
            <CloseIcon />
          </CloseButton>

          <ContentWrap>
            <ContentInner>
              <CompareGrid>
                {selectedItems.map((item, index) => (
                  <CompareColumn key={`${item.id}-${index}`}>
                    <StyledSelectWrap>
                      <StyledSelect
                        value={selectedIds[index] ?? item.id}
                        onChange={(event) =>
                          handleChange(index, event.target.value as string)
                        }
                        IconComponent={ExpandMoreIcon}
                        displayEmpty
                      >
                        {options.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.title}
                          </MenuItem>
                        ))}
                      </StyledSelect>
                    </StyledSelectWrap>

                    <ThumbBox>
                      <StyledThumbImage
                        src={item.imageSrc || "/noimg.png"}
                        alt={item.title}
                        fill
                        sizes="(max-width: 1200px) 33vw, 360px"
                      />
                    </ThumbBox>

                    <SoundButton
                      type="button"
                      disabled={!item.soundUrl}
                      onClick={() => handleTogglePlay(index, item.soundUrl)}
                    >
                      <Image
                        src={playingIndex === index ? PAUSE_ICON : PLAY_ICON}
                        alt="play icon"
                        width={28}
                        height={28}
                      />
                      <span>{item.soundLabel}</span>
                    </SoundButton>

                    {item.description && (
                      <>
                        <DividerLine />
                        <DescriptionText>{item.description}</DescriptionText>
                      </>
                    )}
                  </CompareColumn>
                ))}
              </CompareGrid>
            </ContentInner>
          </ContentWrap>
        </ModalWrap>
      </Overlay>
    </Modal>
  );
}

const Overlay = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 10%",

  [theme.breakpoints.down("md")]: {
    padding: "30px 10%",
  },

  [theme.breakpoints.down("sm")]: {
    padding: "20px 5%",
  },
}));

const ModalWrap = styled(Box)(() => ({
  position: "relative",
  width: "100%",
  maxWidth: "1200px",
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "-62px",
  right: "0px",
  width: "44px",
  height: "44px",
  backgroundColor: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.common.white,
  },
  "& .MuiSvgIcon-root": {
    fontSize: "28px",
    color: theme.palette.text.primary,
  },

  [theme.breakpoints.down("md")]: {
    top: "-58px",
    width: "40px",
    height: "40px",
    "& .MuiSvgIcon-root": {
      fontSize: "22px",
    },
  },

  [theme.breakpoints.down("sm")]: {
    top: "-50px",
    width: "36px",
    height: "36px",
    "& .MuiSvgIcon-root": {
      fontSize: "18px",
    },
  },
}));

const ContentWrap = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "80vh",
  overflow: "hidden",
  borderRadius: "10px",
  backgroundColor: theme.palette.common.white,
  padding: "30px 20px",
  boxSizing: "border-box",
}));

const ContentInner = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  overflowX: "visible",

  [theme.breakpoints.down("md")]: {
    overflowX: "auto",
    overflowY: "hidden",
  },
}));

const CompareGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  columnGap: "20px",

  overflowY: "scroll",
  overflowX: "hidden",

  height: "100%",

  [theme.breakpoints.down("md")]: {
    minWidth: "900px",
  },

  [theme.breakpoints.down("sm")]: {
    minWidth: "900px",
  },
}));

const CompareColumn = styled(Box)(() => ({
  width: "100%",
}));

const StyledSelectWrap = styled(Box)(({ theme }) => ({
  width: "100%",
  marginBottom: "24px",

  [theme.breakpoints.down("md")]: {
    marginBottom: "20px",
  },

  [theme.breakpoints.down("sm")]: {
    marginBottom: "16px",
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  width: "100%",
  height: "56px",
  borderRadius: "5px",
  backgroundColor: theme.palette.common.white,
  fontSize: "1rem",
  fontWeight: 500,
  color: theme.palette.grey[800],

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#D9D9D9",
  },
  "& .MuiSelect-select": {
    padding: "16px",
    boxSizing: "border-box",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "1.5rem",
    color: theme.palette.common.black,
    right: "12px",
  },

  [theme.breakpoints.down("md")]: {
    height: "50px",

    "& .MuiSelect-select": {
      padding: "12px",
    },
    "& .MuiSvgIcon-root": {
      fontSize: "1.2rem",
      right: "12px",
    },
  },

  [theme.breakpoints.down("sm")]: {
    height: "46px",

    "& .MuiSelect-select": {},
    "& .MuiSvgIcon-root": {
      fontSize: "1rem",
    },
  },
}));

const ThumbBox = styled(Box)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  width: "100%",
  aspectRatio: "1.74 / 1",
  backgroundColor: theme.palette.grey[200],
  padding: "0 20px 0 20px",
  boxSizing: "border-box",
}));

const StyledThumbImage = styled(Image)(() => ({
  objectFit: "cover",
}));

const SoundButton = styled("button")(({ theme }) => ({
  marginTop: "28px",
  width: "100%",
  border: "none",
  padding: "0px",
  background: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  cursor: "pointer",
  color: theme.palette.text.primary,
  fontSize: "1rem",
  fontWeight: 400,
  "&:disabled": {
    color: theme.palette.grey[300],
    cursor: "not-allowed",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "28px",
  },

  [theme.breakpoints.down("md")]: {
    marginTop: "22px",
    gap: "10px",
    "& .MuiSvgIcon-root": {
      fontSize: "22px",
    },
  },

  [theme.breakpoints.down("sm")]: {
    marginTop: "18px",
    gap: "8px",
    "& .MuiSvgIcon-root": {
      fontSize: "18px",
    },
  },
}));

const DividerLine = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "1px",
  backgroundColor: theme.palette.divider,
  marginTop: "28px",

  [theme.breakpoints.down("md")]: {
    marginTop: "22px",
  },

  [theme.breakpoints.down("sm")]: {
    marginTop: "18px",
  },
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  marginTop: "24px",
  fontSize: "1rem",
  fontWeight: 400,
  lineHeight: 1.6,
  color: theme.palette.text.secondary,
  textAlign: "center",
  whiteSpace: "pre-line",

  [theme.breakpoints.down("md")]: {
    marginTop: "20px",
  },

  [theme.breakpoints.down("sm")]: {
    marginTop: "16px",
  },
}));
