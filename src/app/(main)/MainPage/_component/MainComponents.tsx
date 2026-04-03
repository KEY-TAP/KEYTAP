"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HEARING_ICON, PAUSE_ICON, PLAY_ICON } from "@/common/icons/icons";

// mui
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// mui icons
import { KEYBOARD_ROWS } from "@/utils/keyRow";
import { KeyItem } from "@/types/keyboard.type";

export default function MainComponent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const mobileInputRef = useRef<HTMLTextAreaElement | null>(null);

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [typedText, setTypedText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const [isInputFocused, setIsInputFocused] = useState(false);

  const addPressedKey = (key: string) => {
    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  const removePressedKey = (key: string) => {
    setPressedKeys((prev) => {
      setIsInputFocused(true); // 커서

      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const handlePressKeyDown = (e: KeyboardEvent) => {
    addPressedKey(e.code);

    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.repeat) return;

    if (e.key === "Backspace") {
      setTypedText((prev) => prev.slice(0, -1));
      return;
    }

    if (e.key === "Enter") {
      setTypedText((prev) => `${prev}\n`);
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      setTypedText((prev) => `${prev}\t`);
      return;
    }

    if (e.key === " ") {
      e.preventDefault();
      setTypedText((prev) => `${prev} `);
      return;
    }

    if (e.key.length === 1) {
      setTypedText((prev) => prev + e.key);
    }

    console.log("클릭");
  };

  const handlePressKeyUp = (e: KeyboardEvent) => {
    removePressedKey(e.code);
  };

  useEffect(() => {
    if (isMobile) return;

    window.addEventListener("keydown", handlePressKeyDown);
    window.addEventListener("keyup", handlePressKeyUp);

    return () => {
      window.removeEventListener("keydown", handlePressKeyDown);
      window.removeEventListener("keyup", handlePressKeyUp);
    };
  });

  const handleVirtualKeyDown = (key: KeyItem) => {
    setIsInputFocused(true); // 커서
    if (!key.code) return;

    addPressedKey(key.code);

    if (key.code === "Backspace") {
      setTypedText((prev) => prev.slice(0, -1));
      return;
    }

    if (key.code === "Enter") {
      setTypedText((prev) => `${prev}\n`);
      return;
    }

    if (key.code === "Tab") {
      setTypedText((prev) => `${prev}\t`);
      return;
    }

    if (key.code === "Space") {
      setTypedText((prev) => `${prev} `);
      return;
    }

    if (key.value) {
      setTypedText((prev) => prev + key.value);
    }
  };

  const handleVirtualKeyUp = (key: KeyItem) => {
    if (!key.code) return;
    removePressedKey(key.code);
  };

  const handleMobileTouchInput = () => {
    mobileInputRef.current?.focus();
  };

  const handleMobileInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTypedText(e.target.value);
  };

  // 포커스 될 때 커서 깜빡임
  const handleDisplayFocus = () => {
    setIsInputFocused(true);

    if (isMobile) {
      mobileInputRef.current?.focus();
    }
  };

  return (
    <Main>
      <Section>
        <GuideRow>
          <Image src={HEARING_ICON} alt="play icon" width={28} height={28} />
          <GuideText>소리를 듣기 위해 영문키를 눌러주세요.</GuideText>
        </GuideRow>

        <DisplayBox onClick={handleDisplayFocus}>
          <DisplayText hasValue={!!typedText}>
            {typedText || "입력한 영문 텍스트가 이곳에 표시 됩니다"}
            {isInputFocused && <FakeCaret />}
          </DisplayText>
        </DisplayBox>

        {isMobile ? (
          <MobileInputSection>
            <MobileTouchButton type="button" variant="outlined" onClick={handleMobileTouchInput}>
              이곳을 터치하여 입력해보세요
            </MobileTouchButton>

            <HiddenMobileInput
              ref={mobileInputRef}
              value={typedText}
              onChange={handleMobileInputChange}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </MobileInputSection>
        ) : (
          <KeyboardWrap>
            {KEYBOARD_ROWS.map((row, rowIndex) => (
              <KeyRow key={`row-${rowIndex}`}>
                {row.map((key, index) => {
                  const isPressed = key.code ? pressedKeys.has(key.code) : false;

                  return (
                    <KeyButton
                      key={`${key.label}-${index}`}
                      type="button"
                      active={isPressed ? 1 : 0}
                      widthRatio={key.width ?? 1}
                      onMouseDown={() => handleVirtualKeyDown(key)}
                      onMouseUp={() => handleVirtualKeyUp(key)}
                      onMouseLeave={() => handleVirtualKeyUp(key)}
                      onTouchStart={() => handleVirtualKeyDown(key)}
                      onTouchEnd={() => handleVirtualKeyUp(key)}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      {key.label}
                    </KeyButton>
                  );
                })}
              </KeyRow>
            ))}
          </KeyboardWrap>
        )}

        <AudioSection>
          <AudioButton type="button" onClick={() => setIsPlaying((prev) => !prev)}>
            {isPlaying ? (
              <Image src={PAUSE_ICON} alt="play icon" width={28} height={28} />
            ) : (
              <Image src={PLAY_ICON} alt="play icon" width={28} height={28} />
            )}
            <AudioTitle>NUPHY KICK75</AudioTitle>
          </AudioButton>

          <AudioDescription>미리 녹음된 타건음을 들으실 수 있습니다.</AudioDescription>
        </AudioSection>
      </Section>
    </Main>
  );
}

const Main = styled("main")(() => ({
  width: "100%",
}));

const Section = styled(Box)(({ theme }) => ({
  width: "100%",
  margin: "0 auto",

  [theme.breakpoints.down("md")]: {},

  [theme.breakpoints.down("sm")]: {},
}));

const GuideRow = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "26px",
}));

const GuideText = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

const DisplayBox = styled(Box)(({ theme }) => ({
  minHeight: "226px",
  borderRadius: "14px",
  background: theme.palette.common.white,
  boxShadow: "0 6px 24px rgba(0, 0, 0, 0.12)",
  padding: "28px 40px",
  marginBottom: "24px",
  cursor: "text",

  [theme.breakpoints.down("sm")]: {
    minHeight: "180px",
    padding: "22px 20px",
    marginBottom: "20px",
  },
}));

const DisplayText = styled("pre", {
  shouldForwardProp: (prop) => prop !== "hasValue",
})<{ hasValue?: boolean }>(({ theme, hasValue }) => ({
  margin: 0,
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  fontFamily: "inherit",
  fontSize: "1.125rem",
  lineHeight: 1.55,
  color: hasValue ? theme.palette.text.primary : theme.palette.grey[300],
}));

const FakeCaret = styled("span")(({ theme }) => ({
  // 가상 커서

  display: "inline-block",
  width: "1px",
  height: "1.1em",
  marginLeft: "2px",
  background: theme.palette.text.primary,
  verticalAlign: "text-bottom",
  animation: "blink 1s step-end infinite",
  "@keyframes blink": {
    "0%, 50%": {
      opacity: 1,
    },
    "50.01%, 100%": {
      opacity: 0,
    },
  },
}));

const KeyboardWrap = styled(Box)(({ theme }) => ({
  width: "100%",
  border: `4px solid ${theme.palette.grey[300]}`,
  borderRadius: "12px",
  padding: "14px 12px",
  background: theme.palette.background.default,
  marginBottom: "28px",

  [theme.breakpoints.down("md")]: {
    padding: "10px",
  },
}));

const KeyRow = styled(Box)(() => ({
  display: "flex",
  gap: "6px",
  marginBottom: "10px",

  "&:last-of-type": {
    marginBottom: 0,
  },
}));

const KeyButton = styled("button", {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "widthRatio",
})<{ active?: number; widthRatio?: number }>(({ theme, active, widthRatio }) => ({
  flex: `${widthRatio ?? 1} 1 0`,
  minWidth: 0,
  height: "60px",
  borderRadius: "11px",
  border: `1px solid ${active ? "rgba(156, 157, 170, 0.8)" : "#9C9DAA"}`,
  background: active ? "rgba(173, 179, 255, 0.4)" : theme.palette.common.white,
  color: theme.palette.text.secondary,
  fontSize: "1rem",
  wordBreak: "break-all",
  fontWeight: 500,
  boxShadow: active ? "0 2px 4px rgba(0,0,0,0.08)" : "0 4px 8px rgba(0,0,0,0.10)",
  cursor: "pointer",
  transition:
    "transform .12s ease, background-color .12s ease, border-color .12s ease, box-shadow .12s ease",
  userSelect: "none",
  transform: active ? "translateY(2px)" : "translateY(0)",

  "&:active": {
    transform: "translateY(2px)",
    background: "rgba(173, 179, 255, 0.4)",
    borderColor: "rgba(156, 157, 170, 0.8)",
  },
}));

const MobileInputSection = styled(Box)(() => ({
  marginBottom: "28px",
}));

const MobileTouchButton = styled(Button)(({ theme }) => ({
  width: "100%",
  height: "56px",
  borderRadius: "12px",
  background: theme.palette.common.white,
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  fontSize: "1rem",
  fontWeight: 600,

  "&:hover": {
    background: theme.palette.common.white,
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    boxShadow: "0 6px 16px rgba(0,0,0,0.10)",
  },
}));

const HiddenMobileInput = styled("textarea")(() => ({
  position: "absolute",
  opacity: 0,
  pointerEvents: "none",
  width: 1,
  height: 1,
  resize: "none",
}));

const AudioSection = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "6px",
}));

const AudioButton = styled("button")(({ theme }) => ({
  border: "none",
  background: "transparent",
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
  color: theme.palette.common.black,
  transition: "color .2s ease",

  "& svg": {
    fontSize: "2rem",
    transition: "color .2s ease",
  },

  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const AudioTitle = styled(Typography)(() => ({
  fontSize: "1.375rem",
  fontWeight: 800,
  lineHeight: 1,
}));

const AudioDescription = styled(Typography)(({ theme }) => ({
  marginTop: "14px",
  fontSize: "1rem",
  color: theme.palette.text.secondary,
  textAlign: "center",
}));
