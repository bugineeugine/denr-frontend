"use client";
import { green } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});
const defaultTheme = createTheme();
export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light: green[300],
        main: green[500],
        dark: green[600],
        contrastText: green[50],
      },
    },
  },
  dark: {
    palette: {
      primary: {
        contrastText: green[50],
        light: green[300],
        main: green[400],
        dark: green[700],
      },
    },
  },
};
const theme = createTheme({
  colorSchemes,
  defaultColorScheme: "light",
  cssVariables: {
    colorSchemeSelector: "data",
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    fontSize: 12.5,
    h1: {
      fontSize: defaultTheme.typography.pxToRem(48),
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: defaultTheme.typography.pxToRem(36),
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: defaultTheme.typography.pxToRem(30),
      lineHeight: 1.2,
    },
    h4: {
      fontSize: defaultTheme.typography.pxToRem(24),
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: defaultTheme.typography.pxToRem(20),
      fontWeight: 600,
    },
    h6: {
      fontSize: defaultTheme.typography.pxToRem(18),
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: defaultTheme.typography.pxToRem(18),
    },
    subtitle2: {
      fontSize: defaultTheme.typography.pxToRem(14),
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
        },
      },
    },
  },
});

export default theme;
