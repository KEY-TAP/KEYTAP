// theme/theme.ts
import { createTheme } from "@mui/material/styles";

const COLORS = {
  // Brand
  primary: "#112F78",
  secondary: "#E8E9F2",

  // Neutral (white ~ grey ~ black)
  white: "#FFFFFF",
  grey100: "#E8E8E8",
  grey200: "#D9D9D9",
  grey300: "#C9C9C9",
  grey600: "#777777",
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
  },

  palette: {
    mode: "light",
    primary: { main: COLORS.primary },
    secondary: { main: COLORS.secondary },

    background: {
      default: COLORS.white,
      paper: COLORS.secondary,
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
      600: COLORS.grey600, // 777777
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
