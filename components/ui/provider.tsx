"use client";
import { ThemeProvider } from "next-themes";

export default function Providers({
  children,
  ...props
}: React.ComponentProps<typeof ThemeProvider>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </ThemeProvider>
  );
}
