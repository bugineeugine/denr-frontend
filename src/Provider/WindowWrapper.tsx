"use client";

import { ReactNode } from "react";

const WindowProvider = ({ children }: { children: ReactNode }) => {
  if (typeof window === "undefined") {
    return null;
  }

  return children;
};

export default WindowProvider;
