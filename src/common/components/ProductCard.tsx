// 카드 컴포넌트
"use client";

import React, { useState } from "react";
import Image from "next/image";

// mui
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";

type ProductCardProps = {
  imageSrc?: string;
  title: string;
  price?: number | string;
  tags?: string[];
  switchName?: string;

  showCheck?: boolean;
  showLike?: boolean;

  defaultChecked?: boolean;
  defaultLiked?: boolean;

  onCheckChange?: (checked: boolean) => boolean | void;
  onLikeChange?: (liked: boolean) => void;
};

export default function ProductCard({
  imageSrc = "/image/default-image.png",
  title,
  price,
  tags,
  switchName,

  showCheck = false,
  showLike = false,

  defaultChecked = false,
  defaultLiked = false,

  onCheckChange,
  onLikeChange,
}: ProductCardProps) {
  const [checked, setChecked] = useState(defaultChecked);
  const [liked, setLiked] = useState(defaultLiked);

  const formattedPrice = typeof price === "number" ? `${price.toLocaleString()}원` : price;

  const displayTags = tags?.slice(0, 2) ?? [];

  const handleToggleCheck = () => {
    const nextChecked = !checked;
    const canChange = onCheckChange?.(nextChecked);

    if (canChange === false) {
      return;
    }

    setChecked(nextChecked);
  };

  const handleToggleLike = () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    onLikeChange?.(nextLiked);
  };

  return (
    <CardWrap>
      <ThumbArea>
        {showCheck && (
          <CheckButton
            type="button"
            active={checked ? 1 : 0}
            onClick={handleToggleCheck}
            aria-label={checked ? "선택 해제" : "선택"}
          >
            {checked && <CheckMark />}
          </CheckButton>
        )}

        {switchName && <SwitchBadge>{switchName}</SwitchBadge>}

        <ThumbInner>
          <StyledImage
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 680px) 50vw, (max-width: 980px) 33vw, 320px"
          />
        </ThumbInner>

        {showLike && (
          <LikeButton
            type="button"
            active={liked ? 1 : 0}
            onClick={handleToggleLike}
            aria-label={liked ? "찜 해제" : "찜"}
          >
            <FavoriteIcon />
          </LikeButton>
        )}
      </ThumbArea>

      <InfoArea>
        <TitleText>{title}</TitleText>

        {displayTags.length > 0 ? (
          <TagText>{displayTags.map((tag) => `#${tag}`).join(" ")}</TagText>
        ) : (
          <PriceText>{formattedPrice}</PriceText>
        )}
      </InfoArea>
    </CardWrap>
  );
}

const CardWrap = styled("div")(() => ({
  width: "100%",
}));

const ThumbArea = styled("dl")(() => ({
  position: "relative",
  margin: "0px",
}));

const ThumbInner = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  aspectRatio: "1 / 1",
  overflow: "hidden",
  background: theme.palette.grey[200],
}));

const StyledImage = styled(Image)(() => ({
  objectFit: "cover",
}));

const CheckButton = styled("button", {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: number }>(({ theme, active }) => ({
  position: "absolute",
  top: "8px",
  left: "8px",
  zIndex: 2,
  width: "32px",
  height: "32px",
  border: "none",
  padding: "0px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  background: active ? theme.palette.grey[600] : theme.palette.common.white,
  color: theme.palette.common.white,
}));

const CheckMark = styled("span")(() => ({
  position: "relative",
  display: "inline-block",
  width: "10px",
  height: "10px",
  border: "2px solid currentColor",
  borderTop: "none",
  borderLeft: "none",
  transform: "rotate(45deg)",
  boxSizing: "border-box",
  marginBottom: "2px",
}));

const LikeButton = styled("button", {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: number }>(({ active }) => ({
  position: "absolute",
  right: "8px",
  bottom: "8px",
  zIndex: 2,
  width: "32px",
  height: "32px",
  border: "none",
  padding: "0px",
  background: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "32px",
  lineHeight: 1,
  color: active ? "#FF4B4B" : "#FFFFFF",
}));

const SwitchBadge = styled("span")(({ theme }) => ({
  position: "absolute",
  top: "8px",
  left: "8px",
  zIndex: 2,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "54px",
  height: "26px",
  padding: "0 10px",
  borderRadius: "6px",
  background: theme.palette.common.white,
  color: theme.palette.text.primary,
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: 1,
}));

const InfoArea = styled("dt")(() => ({
  margin: "0px",
  paddingTop: "16px",
  textAlign: "center",
}));

const TitleText = styled(Typography)(() => ({
  fontSize: "1rem",
  fontWeight: 400,
  lineHeight: 1.45,
  color: "#555555",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  wordBreak: "keep-all",
}));

const TagText = styled(Typography)(({ theme }) => ({
  marginTop: "10px",
  fontSize: "1rem",
  fontWeight: 500,
  lineHeight: 1.4,
  color: theme.palette.text.primary,
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  wordBreak: "keep-all",
}));

const PriceText = styled(Typography)(({ theme }) => ({
  marginTop: "10px",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: 1.2,
  color: theme.palette.common.black,
}));
