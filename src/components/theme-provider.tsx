"use client"

import * as React from "react"

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) {
  // Tactical bypass: returns children directly to avoid external module dependency issues.
  return <>{children}</>
}