"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HEARING_ICON, PAUSE_ICON, PLAY_ICON } from "@/common/icons/icons";
import { useProductStore } from "@/store/useProductStore";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";

// mui
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// utils
import { KEYBOARD_ROWS } from "@/utils/keyRow";
import { recordPlayClient } from "@/lib/api/playsClient";
import {
  playKeySound,
  preloadKeySound,
  unlockKeySound,
} from "@/utils/keySound";
import { KeyItem } from "@/types/keyboard.type";

interface Sound {
  sound_id: number;
  sound_url: string;
  sound_type: string;
}

interface SwitchOption {
  product_switch_id?: number; // product_switches.id (재생 기록용)
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
  const desktopInputRef = useRef<HTMLTextAreaElement | null>(null);

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

    // 미리 받아둔 소리가 있으면 바로 재생 (모바일에서도 지연 없이 연타 가능)
    if (playKeySound(singleSound.sound_url)) return;

    // 아직 로드 전이거나 Web Audio를 못 쓰는 환경이면 기존 방식으로 재생
    preloadKeySound(singleSound.sound_url);
    const audio = new Audio(singleSound.sound_url);
    audio.play().catch(() => {});
  };

  // 선택한 제품의 모든 스위치 타건음을 미리 받아둠 (스위치를 바꿔도 바로 소리 나게)
  useEffect(() => {
    selectedProduct?.switches.forEach((sw) => {
      const singleSound = sw.sounds.find((s) => s.sound_type === "single");
      if (singleSound) preloadKeySound(singleSound.sound_url);
    });
  }, [selectedProduct]);

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

      // 재생 횟수 집계용 기록 (실패해도 재생엔 영향 없게 에러는 무시)
      if (selectedSwitch.product_switch_id) {
        recordPlayClient(selectedSwitch.product_switch_id).catch(() => {});
      }
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

  // 탭 문자는 textarea 기본 동작이 포커스 이동이라 직접 넣어줌 (기존처럼 탭 입력 유지)
  const insertTab = (input: HTMLTextAreaElement) => {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    setTypedText((prev) => `${prev.slice(0, start)}\t${prev.slice(end)}`);
    requestAnimationFrame(() => {
      input.selectionStart = input.selectionEnd = start + 1;
    });
  };

  // 데스크톱: 글자 입력/삭제/한글 조합/선택은 textarea가 알아서 처리하고,
  // 여기선 타건음, 키보드 하이라이트, 포커스 이동, 전체 선택만 처리함
  const handlePressKeyDown = (e: KeyboardEvent) => {
    addPressedKey(e.code);

    // 키를 꾹 눌러서 반복될 땐 소리 안 내고 처음 눌렀을 때만 재생 (실제 키보드처럼)
    if (!e.repeat) playSound();

    const input = desktopInputRef.current;
    if (!input) return;

    // 다른 입력창에서 치는 건 건드리지 않음
    const target = e.target as HTMLElement | null;
    const isOtherField =
      !!target &&
      target !== input &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable);
    if (isOtherField) return;

    // Cmd/Ctrl + A: 페이지 전체가 아니라 입력한 텍스트만 선택
    if ((e.metaKey || e.ctrlKey) && e.code === "KeyA") {
      e.preventDefault();
      input.focus();
      input.select();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      input.focus();
      insertTab(input);
      return;
    }

    // 그 외 단축키(복사/붙여넣기 등)는 브라우저 기본 동작에 맡김
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    // 입력창 밖에 포커스가 있어도 바로 입력되게 포커스를 옮겨줌
    if (target !== input) input.focus();
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
    unlockKeySound();
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

  // 입력한 만큼 박스가 같이 늘어나도록 textarea 높이 자동 조절
  useEffect(() => {
    const input = desktopInputRef.current;
    if (!input) return;
    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
  }, [typedText, isMobile]);

  const handleDesktopInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTypedText(e.target.value);
  };

  const handleMobileTouchInput = () => {
    unlockKeySound(); // 터치할 때 모바일 소리 허용 풀어주기
    mobileInputRef.current?.focus();
  };

  const handleMobileInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTypedText(e.target.value);
    // 모바일은 window keydown이 안 잡혀서 입력값이 바뀔 때 직접 소리 재생해줌
    playSound();
  };

  const handleDisplayFocus = () => {
    unlockKeySound();
    setIsInputFocused(true);
    if (isMobile) mobileInputRef.current?.focus();
    else desktopInputRef.current?.focus();
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

        <DisplayBox
          onClick={handleDisplayFocus}
          focused={isMobile && isInputFocused ? 1 : 0}
        >
          {isMobile ? (
            <DisplayText hasValue={!!typedText}>
              {typedText || "입력한 영문 텍스트가 이곳에 표시 됩니다"}
              {isInputFocused && <FakeCaret />}
            </DisplayText>
          ) : (
            <DisplayTextarea
              ref={desktopInputRef}
              value={typedText}
              onChange={handleDesktopInputChange}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="입력한 영문 텍스트가 이곳에 표시 됩니다"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          )}
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

const DisplayBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "focused",
})<{ focused?: number }>(({ theme, focused }) => {
  // 입력 중일 때: 테두리처럼 보이는 1px 링 + 살짝 진한 그림자 (box-shadow라 레이아웃이 안 움직임)
  const focusedShadow = `0 0 0 1px ${theme.palette.primary.main}, 0 8px 28px ${alpha(theme.palette.primary.main, 0.18)}`;

  return {
    minHeight: "226px",
    borderRadius: "14px",
    background: theme.palette.common.white,
    boxShadow: focused ? focusedShadow : "0 6px 24px rgba(0, 0, 0, 0.12)",
    padding: "28px 40px",
    marginBottom: "24px",
    cursor: "text",
    transition: "box-shadow .2s ease",
    "&:focus-within": { boxShadow: focusedShadow },
    [theme.breakpoints.down("sm")]: {
      minHeight: "180px",
      padding: "22px 20px",
      marginBottom: "20px",
    },
    "@media (prefers-reduced-motion: reduce)": { transition: "none" },
  };
});

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

// 데스크톱 입력창: 기존 DisplayText와 같은 글자 모양으로 맞춘 진짜 textarea
const DisplayTextarea = styled("textarea")(({ theme }) => ({
  display: "block",
  width: "100%",
  minHeight: "170px",
  margin: 0,
  padding: 0,
  border: "none",
  outline: "none",
  resize: "none",
  overflow: "hidden",
  background: "transparent",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  fontFamily: "inherit",
  fontSize: "1.125rem",
  lineHeight: 1.55,
  color: theme.palette.text.primary,
  caretColor: theme.palette.primary.main,
  "&::placeholder": {
    color: theme.palette.grey[300],
    opacity: 1,
  },
}));

const FakeCaret = styled("span")(({ theme }) => ({
  display: "inline-block",
  width: "1px",
  height: "1.1em",
  marginLeft: "2px",
  background: theme.palette.primary.main,
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

  // 선택되는 순간 한 번 살짝 튀는 효과 (active가 되면 자동으로 재생됨)
  animation: active ? "switchPickerPop .2s ease-out" : "none",
  "@keyframes switchPickerPop": {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.05)" },
    "100%": { transform: "scale(1)" },
  },

  // 호버는 마우스 환경에서만 (모바일에서 눌린 뒤 호버가 남는 문제 방지)
  "@media (hover: hover)": {
    "&:hover": {
      borderColor: theme.palette.primary.main,
      ...(active
        ? {}
        : {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.primary.main,
          }),
    },
  },

  "&:active": {
    transform: "scale(0.97)",
  },

  // 키보드로 이동할 때만 보이는 포커스 표시
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },

  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
    transition: "none",
    "&:active": { transform: "none" },
  },
}));
