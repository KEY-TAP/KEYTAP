"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HEARING_ICON, PAUSE_ICON, PLAY_ICON } from "@/common/icons/icons";
import { useProductStore } from "@/store/useProductStore";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";

// mui
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// utils
import { KEYBOARD_ROWS } from "@/utils/keyRow";
import { KeyItem } from "@/types/keyboard.type";

interface Sound {
  sound_id: number;
  sound_url: string;
  sound_type: string;
}

interface SwitchOption {
  switch_id: number;
  switch_name: string;
  switch_type: string;
  is_default: boolean;
  sounds: Sound[];
}

interface Product {
  product_id: number;
  product_name: string;
  image_url: string | null;
  switches: SwitchOption[];
}

interface Props {
  products: Product[];
}

export default function MainComponent({ products }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const mobileInputRef = useRef<HTMLTextAreaElement | null>(null);

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [typedText, setTypedText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true); // 사운드 on/off 토글, 기본값 ON

  // 전역 상태에서 선택된 제품 + 스위치 가져오기
  const {
    selectedProduct,
    selectedSwitchId,
    setSelectedProduct,
    setSelectedSwitchId,
  } = useProductStore();

  // 선택된 제품 안에서 실제로 사운드를 재생할 스위치
  const selectedSwitch =
    selectedProduct?.switches.find((sw) => sw.switch_id === selectedSwitchId) ??
    selectedProduct?.switches[0] ??
    null;

  // long 사운드 오디오 객체 (재생/정지 제어용)
  const longAudioRef = useRef<HTMLAudioElement | null>(null);

  // 첫 진입 시 랜덤으로 제품 선택
  useEffect(() => {
    if (products.length === 0) return;
    if (selectedProduct) return;

    const randomIndex = Math.floor(Math.random() * products.length);
    setSelectedProduct(products[randomIndex]);
  }, [products]);

  // single 사운드 재생 (키 누를 때마다)
  const playSound = () => {
    if (!isSoundOn) return;
    if (!selectedSwitch) return;
    const singleSound = selectedSwitch.sounds.find(
      (s) => s.sound_type === "single",
    );
    if (!singleSound) return;

    // 새 Audio 객체 생성해서 즉시 재생 (연타 가능)
    const audio = new Audio(singleSound.sound_url);
    audio.play().catch(() => {});
  };

  // long 사운드 재생/정지 (플레이 버튼)
  // isPlayingRef로 체크해야 클로저 문제 없이 정확한 상태 확인 가능
  const toggleLongSound = () => {
    if (!isSoundOn) return;
    if (!selectedSwitch) return;
    const longSound = selectedSwitch.sounds.find(
      (s) => s.sound_type === "long",
    );
    if (!longSound) return;

    if (isPlayingRef.current) {
      // 정지
      longAudioRef.current?.pause();
      longAudioRef.current = null;
      isPlayingRef.current = false;
      setIsPlaying(false);
    } else {
      // 재생
      const audio = new Audio(longSound.sound_url);
      audio.play().catch(() => {});
      // 재생 끝나면 자동으로 정지 상태로 변경
      audio.onended = () => {
        isPlayingRef.current = false;
        setIsPlaying(false);
      };
      longAudioRef.current = audio;
      isPlayingRef.current = true;
      setIsPlaying(true);
    }
  };

  // 제품/스위치 변경 시 long 사운드 정지
  useEffect(() => {
    return () => {
      if (longAudioRef.current) {
        longAudioRef.current.pause();
        longAudioRef.current.onended = null;
        longAudioRef.current = null;
        isPlayingRef.current = false;
      }
    };
  }, [selectedProduct, selectedSwitchId]);

  // 사운드 토글: OFF로 전환하는 경우 재생 중인 long 사운드도 즉시 정지
  const handleToggleSound = () => {
    setIsSoundOn((prev) => {
      const next = !prev;

      if (!next && longAudioRef.current) {
        longAudioRef.current.pause();
        longAudioRef.current.onended = null;
        longAudioRef.current = null;
        isPlayingRef.current = false;
        setIsPlaying(false);
      }

      return next;
    });
  };

  const addPressedKey = (key: string) => {
    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  const removePressedKey = (key: string) => {
    setPressedKeys((prev) => {
      setIsInputFocused(true);
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const handlePressKeyDown = (e: KeyboardEvent) => {
    addPressedKey(e.code);
    playSound();

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
    if (e.key.length === 1) setTypedText((prev) => prev + e.key);
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
    setIsInputFocused(true);
    if (!key.code) return;
    addPressedKey(key.code);
    playSound();

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
    if (key.value) setTypedText((prev) => prev + key.value);
  };

  const handleVirtualKeyUp = (key: KeyItem) => {
    if (!key.code) return;
    removePressedKey(key.code);
  };

  const handleMobileTouchInput = () => {
    mobileInputRef.current?.focus();
  };

  const handleMobileInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTypedText(e.target.value);
  };

  const handleDisplayFocus = () => {
    setIsInputFocused(true);
    if (isMobile) mobileInputRef.current?.focus();
  };

  return (
    <Main>
      <Section>
        <TopRow>
          <GuideRow>
            <Image src={HEARING_ICON} alt="play icon" width={28} height={28} />
            <GuideText>소리를 듣기 위해 영문키를 눌러주세요.</GuideText>
          </GuideRow>

          <SoundToggleButton
            type="button"
            active={isSoundOn ? 1 : 0}
            onClick={handleToggleSound}
            aria-pressed={isSoundOn}
            aria-label={isSoundOn ? "사운드 끄기" : "사운드 켜기"}
          >
            {isSoundOn ? (
              <VolumeUpRoundedIcon fontSize="small" />
            ) : (
              <VolumeOffRoundedIcon fontSize="small" />
            )}
            <span>{isSoundOn ? "사운드 ON" : "사운드 OFF"}</span>
          </SoundToggleButton>
        </TopRow>

        <DisplayBox onClick={handleDisplayFocus}>
          <DisplayText hasValue={!!typedText}>
            {typedText || "입력한 영문 텍스트가 이곳에 표시 됩니다"}
            {isInputFocused && <FakeCaret />}
          </DisplayText>
        </DisplayBox>

        {isMobile ? (
          <MobileInputSection>
            <MobileTouchButton
              type="button"
              variant="outlined"
              onClick={handleMobileTouchInput}
            >
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
                  const isPressed = key.code
                    ? pressedKeys.has(key.code)
                    : false;
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

        {/* 선택된 제품명 + 플레이 버튼 */}
        <AudioSection>
          <AudioButton type="button" onClick={toggleLongSound}>
            {isPlaying ? (
              <Image src={PAUSE_ICON} alt="pause icon" width={28} height={28} />
            ) : (
              <Image src={PLAY_ICON} alt="play icon" width={28} height={28} />
            )}
            <AudioTitle>
              {selectedProduct?.product_name ?? "모델을 선택해주세요"}
            </AudioTitle>
          </AudioButton>

          {selectedProduct && selectedProduct.switches.length > 1 && (
            <SwitchPicker>
              {selectedProduct.switches.map((sw) => (
                <SwitchPickerButton
                  key={sw.switch_id}
                  type="button"
                  active={selectedSwitchId === sw.switch_id ? 1 : 0}
                  onClick={() => setSelectedSwitchId(sw.switch_id)}
                >
                  {sw.switch_name}
                </SwitchPickerButton>
              ))}
            </SwitchPicker>
          )}

          <AudioDescription>
            미리 녹음된 타건음을 들으실 수 있습니다.
          </AudioDescription>
        </AudioSection>
      </Section>
    </Main>
  );
}

const Main = styled("main")(() => ({ width: "100%" }));

const Section = styled(Box)(({ theme }) => ({
  width: "100%",
  margin: "0 auto",
  [theme.breakpoints.down("md")]: {},
  [theme.breakpoints.down("sm")]: {},
}));

const TopRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "12px",
  marginBottom: "26px",
  [theme.breakpoints.down("sm")]: {
    marginBottom: "20px",
  },
}));

const GuideRow = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
}));

const SoundToggleButton = styled("button", {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: number }>(({ theme, active }) => ({
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
  gap: "6px",
  height: "36px",
  padding: "0 14px",
  borderRadius: "5px",
  border: `1px solid ${active ? theme.palette.primary.main : theme.palette.divider}`,
  background: active
    ? theme.palette.primary.main
    : theme.palette.background.default,
  color: active ? theme.palette.common.white : theme.palette.text.secondary,
  fontSize: "0.875rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all .2s ease",

  "& svg": { fontSize: "1.125rem" },

  "&:hover": {
    borderColor: theme.palette.primary.main,
    color: active ? theme.palette.common.white : theme.palette.primary.main,
  },

  [theme.breakpoints.down("sm")]: {
    height: "32px",
    padding: "0 10px",
    fontSize: "0.8rem",

    "& span": { display: "none" },
  },
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
  display: "inline-block",
  width: "1px",
  height: "1.1em",
  marginLeft: "2px",
  background: theme.palette.text.primary,
  verticalAlign: "text-bottom",
  animation: "blink 1s step-end infinite",
  "@keyframes blink": {
    "0%, 50%": { opacity: 1 },
    "50.01%, 100%": { opacity: 0 },
  },
}));

const KeyboardWrap = styled(Box)(({ theme }) => ({
  width: "100%",
  border: `4px solid ${theme.palette.grey[300]}`,
  borderRadius: "12px",
  padding: "14px 12px",
  background: theme.palette.background.default,
  marginBottom: "28px",
  [theme.breakpoints.down("md")]: { padding: "10px" },
}));

const KeyRow = styled(Box)(() => ({
  display: "flex",
  gap: "6px",
  marginBottom: "10px",
  "&:last-of-type": { marginBottom: 0 },
}));

const KeyButton = styled("button", {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "widthRatio",
})<{ active?: number; widthRatio?: number }>(
  ({ theme, active, widthRatio }) => ({
    flex: `${widthRatio ?? 1} 1 0`,
    minWidth: 0,
    height: "60px",
    borderRadius: "11px",
    border: `1px solid ${active ? "rgba(156, 157, 170, 0.8)" : "#9C9DAA"}`,
    background: active
      ? "rgba(173, 179, 255, 0.4)"
      : theme.palette.common.white,
    color: theme.palette.text.secondary,
    fontSize: "1rem",
    wordBreak: "break-all",
    fontWeight: 500,
    boxShadow: active
      ? "0 2px 4px rgba(0,0,0,0.08)"
      : "0 4px 8px rgba(0,0,0,0.10)",
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
  }),
);

const MobileInputSection = styled(Box)(() => ({ marginBottom: "28px" }));

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
  "& svg": { fontSize: "2rem", transition: "color .2s ease" },
  "&:hover": { color: theme.palette.primary.main },
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

const SwitchPicker = styled(Box)(() => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "8px",
  marginTop: "16px",
}));

const SwitchPickerButton = styled("button", {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: number }>(({ theme, active }) => ({
  border: `1px solid ${active ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: "5px",
  padding: "8px 16px",
  fontSize: "0.9rem",
  fontWeight: active ? 700 : 400,
  color: active ? theme.palette.common.white : theme.palette.text.primary,
  backgroundColor: active
    ? theme.palette.primary.main
    : theme.palette.background.default,
  cursor: "pointer",
  transition: "all .2s ease",

  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
}));
