"use client";
import theme from "@/themes/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as ProviderTheme } from "@mui/material/styles";
import { ReactNode } from "react";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ProviderTheme theme={theme} defaultMode="dark" storageWindow={window}>
        <CssBaseline />
        {children}
      </ProviderTheme>
    </AppRouterCacheProvider>
  );
};

export default ThemeProvider;
