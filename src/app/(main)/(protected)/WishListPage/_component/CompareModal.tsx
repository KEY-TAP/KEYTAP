"use client";

import { useState } from "react";
import Image from "next/image";
import { PLAY_ICON, PAUSE_ICON } from "@/common/icons/icons";

// mui
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import theme from "../../../../../theme/theme";

// mui icons
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export type CompareProduct = {
  id: number;
  title: string;
  price: number;
  imageSrc?: string;
  colorName: string;
  colorChips: string[];
  soundLabel: string;
  features: string[];
};

type CompareModalProps = {
  open: boolean;
  onClose: () => void;
  items: CompareProduct[];
  options: CompareProduct[];
};

export default function CompareModal({ open, onClose, items, options }: CompareModalProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>(() => items.map((item) => item.id));
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const handleTogglePlay = (index: number) => {
    setPlayingIndex((prev) => (prev === index ? null : index));
  };

  const handleChange = (index: number, value: string) => {
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
      onClose={onClose}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.6)",
        },
      }}
    >
      <Overlay onClick={onClose}>
        <ModalWrap onClick={(e) => e.stopPropagation()}>
          <CloseButton type="button" onClick={onClose} aria-label="닫기">
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
                        onChange={(event) => handleChange(index, event.target.value as string)}
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

                    <ColorArea>
                      <ColorChipRow>
                        {item.colorChips.map((chip, chipIndex) => (
                          <ColorChip
                            key={`${chip}-${chipIndex}`}
                            chipcolor={chip}
                            bordered={chip === `${theme.palette.background.default}` ? 1 : 0}
                          />
                        ))}
                      </ColorChipRow>
                      <ColorName>{item.colorName}</ColorName>
                      <PriceText>{item.price.toLocaleString()}원</PriceText>
                    </ColorArea>

                    <SoundButton type="button" onClick={() => handleTogglePlay(index)}>
                      <Image
                        src={playingIndex === index ? PAUSE_ICON : PLAY_ICON}
                        alt="play icon"
                        width={28}
                        height={28}
                      />
                      <span>{item.soundLabel}</span>
                    </SoundButton>

                    <DividerLine />

                    <FeatureList>
                      {item.features.map((feature, featureIndex) => (
                        <FeatureItem key={`${feature}-${featureIndex}`}>{feature}</FeatureItem>
                      ))}
                    </FeatureList>
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

const CompareGrid = styled(Box)(() => ({
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

const ColorArea = styled(Box)(({ theme }) => ({
  paddingTop: "20px",
  textAlign: "center",

  [theme.breakpoints.down("md")]: {
    paddingTop: "16px",
  },

  [theme.breakpoints.down("sm")]: {
    paddingTop: "12px",
  },
}));

const ColorChipRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",

  [theme.breakpoints.down("md")]: {},

  [theme.breakpoints.down("sm")]: {
    gap: "8px",
  },
}));

const ColorChip = styled("span", {
  shouldForwardProp: (prop) => prop !== "chipcolor" && prop !== "bordered",
})<{ chipcolor: string; bordered?: number }>(({ chipcolor, bordered, theme }) => ({
  display: "inline-block",
  width: "28px",
  height: "28px",
  borderRadius: "100%",
  backgroundColor: chipcolor,
  border: bordered ? "1px solid #D9D9D9" : "none",

  [theme.breakpoints.down("md")]: {
    width: "22px",
    height: "22px",
  },

  [theme.breakpoints.down("sm")]: {
    width: "18px",
    height: "18px",
  },
}));

const ColorName = styled(Typography)(({ theme }) => ({
  marginTop: "8px",
  fontSize: "14px",
  fontWeight: 300,
  lineHeight: 1.4,
  color: theme.palette.grey[800],

  [theme.breakpoints.down("md")]: {},

  [theme.breakpoints.down("sm")]: {
    marginTop: "6px",
  },
}));

const PriceText = styled(Typography)(({ theme }) => ({
  marginTop: "16px",
  fontSize: "1rem",
  fontWeight: 700,
  lineHeight: 1.2,
  color: theme.palette.grey[800],

  [theme.breakpoints.down("md")]: {
    marginTop: "12px",
  },

  [theme.breakpoints.down("sm")]: {
    marginTop: "8px",
  },
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

const FeatureList = styled(Box)(() => ({
  marginTop: "32px",
  textAlign: "center",

  [theme.breakpoints.down("md")]: {
    marginTop: "26px",
  },

  [theme.breakpoints.down("sm")]: {
    marginTop: "22px",
  },
}));

const FeatureItem = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 400,
  lineHeight: 1.6,
  color: theme.palette.text.secondary,
  "& + &": {
    marginTop: "24px",
  },

  [theme.breakpoints.down("md")]: {
    "& + &": {
      marginTop: "20px",
    },
  },

  [theme.breakpoints.down("sm")]: {
    "& + &": {
      marginTop: "16px",
    },
  },
}));
