// theme/theme.ts
import { createTheme } from "@mui/material/styles";

const COLORS = {
  // Brand
  primary: "#112F78",
  secondary: "#E8E9F2",

  // 섹션 배경 (첫 화면 히어로 등 넓은 면에 쓰는 아주 옅은 회색)
  subtle: "#F5F5F8",

  // Neutral (white ~ grey ~ black)
  white: "#FFFFFF",
  grey100: "#E8E8E8",
  grey200: "#D9D9D9",
  grey300: "#C9C9C9",
  grey500: "#999999",
  grey600: "#777777",
  grey700: "#555555",
  grey800: "#333333",
  black: "#000000",
};

/**
 * next/font로 body에 className `${inter.variable} ${jetbrains.variable} ${d2coding.variable}`
 * 이런 식으로 붙이면 아래 CSS 변수들이 살아남:
 *  - --font-inter (Inter)
 *  - --font-mono  (JetBrains Mono)
 *  - --font-d2    (D2Coding)
 *
 * theme에서는 CSS 변수 기반으로 지정해두면 관리가 편함.
 */

// palette.background에 subtle 추가 (타입 확장)
declare module "@mui/material/styles" {
  interface TypeBackground {
    subtle: string;
  }
}

const FONT_BASE =
  'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';

const baseTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 680,
      md: 980,
      lg: 1300,
      xl: 1920,
    },
    // 미디어쿼리 경계값을 정수로 맞춤 (MUI 기본 step 5 → down("md")가 979.95px로 생성됨)
    // step 100 → down("md") = max-width: 979px, down("sm") = max-width: 679px (up()은 변화 없음)
    // 브라우저 확대로 폭이 979~980px 사이 소수가 되면 down("md")가 빠져 980px(PC) 화면과 같게 보임
    // 반응형은 항상 theme.breakpoints.up/down()으로 작성하고, @media (max-width: 980px)처럼 직접 쓰지 않기
    // (직접 쓰면 경계값이 어긋나 같은 폭에서 서로 다른 스타일이 적용될 수 있음)
    step: 100,
  },

  palette: {
    mode: "light",
    primary: { main: COLORS.primary },
    secondary: { main: COLORS.secondary },

    background: {
      default: COLORS.white,
      paper: COLORS.secondary,
      subtle: COLORS.subtle,
    },

    text: {
      primary: COLORS.grey800,
      secondary: COLORS.grey600,
    },

    divider: COLORS.grey200,

    grey: {
      50: COLORS.white,
      100: COLORS.grey100, // E8E8E8
      200: COLORS.grey200, // D9D9D9
      300: COLORS.grey300, // C9C9C9
      500: COLORS.grey500, // 999999
      600: COLORS.grey600, // 777777
      700: COLORS.grey700, // 555555
      800: COLORS.grey800, // 333333
      900: COLORS.black,
    },
  },

  typography: {
    fontFamily: FONT_BASE,

    h1: {
      fontWeight: 700,
      fontSize: "3rem",
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "1.5rem",
      letterSpacing: "-0.02em",
    },
    body1: {
      fontSize: "1rem",
    },
    subtitle1: {
      fontSize: "1.111rem",
      marginTop: "16px",
    },
  },
});

const theme = createTheme(baseTheme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*, *::before, *::after": { boxSizing: "border-box" },

        html: { width: "100%", fontSize: "16px" },

        body: {
          width: "100%",
          minWidth: "320px",
          margin: 0,
          color: COLORS.grey800,
          backgroundColor: COLORS.white,

          fontWeight: 400,
          fontSize: "1rem",
          lineHeight: "150%",
          letterSpacing: "-0.64px",
          fontFamily: FONT_BASE,

          wordBreak: "keep-all",
          WebkitTextSizeAdjust: "none",
        },

        // reset
        "ul, ol, li": { listStyle: "none", margin: 0, padding: 0 },
        a: {
          cursor: "pointer",
          textDecoration: "none",
          color: "inherit",
          transition: "all 0.7s cubic-bezier(0.215, 0.61, 0.355, 1)",
        },
        table: {
          borderCollapse: "separate",
          borderSpacing: 0,
          fontSize: "0.9375rem",
        },
        "table caption": { overflow: "hidden", fontSize: 0, lineHeight: 0 },
        address: { fontStyle: "normal" },
        hr: { display: "none" },

        // focus outline 제거
        "input:focus, textarea:focus, button:focus": { outline: "none" },

        // placeholder
        "input::placeholder, textarea::placeholder": { color: "#999" },

        "select::-ms-expand": { display: "none" },
        'input[type="text"]::-ms-clear': { display: "none" },

        // code 폰트
        "code, pre, kbd, samp": {
          fontFamily:
            'var(--font-mono), var(--font-d2), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        },

        // md 이하 (≤980)
        [baseTheme.breakpoints.down("md")]: {
          html: { fontSize: "16px", letterSpacing: "-0.54px" },
        },

        // sm 이하 (≤680)
        [baseTheme.breakpoints.down("sm")]: {
          html: { fontSize: "14px" },
          body: { lineHeight: "120%" },

          // input/textarea에서만 자동 확대 방지
          "input, textarea": {
            textSizeAdjust: "none",
            WebkitTextSizeAdjust: "none",
          },
        },
      },
    },

    // 버튼 기본 톤
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          fontWeight: 600,
          transition: "all .3s ease",
        },
        containedPrimary: {
          color: COLORS.white,
        },
      },
    },

    // 컨테이너 기본 톤
    MuiContainer: {
      defaultProps: {
        maxWidth: false,
        disableGutters: true,
      },
    },

    // 인풋 기본 톤
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: COLORS.white,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: COLORS.grey200 },
      },
    },
  },
});

export default theme;
