// app/_layout.tsx
"use client";

import React from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext"; // Adjust the path if needed

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
