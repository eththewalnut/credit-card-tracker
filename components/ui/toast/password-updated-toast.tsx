"use client";

import { useEffect } from "react";
import { toast } from "sonner"; // or your toast lib

export function PasswordUpdatedToast() {
  useEffect(() => {
    const hasCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("password_updated="));

    if (hasCookie) {
      toast.success("Password has been updated!");

      // clear it immediately
      document.cookie = "password_updated=; Max-Age=0; path=/;";
    }
  }, []);

  return null;
}
