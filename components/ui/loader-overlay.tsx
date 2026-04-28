"use client";

import { ClipLoader } from "react-spinners";

export default function LoaderOverlay({
  loading,
  loadingText,
}: {
  loading: boolean;
  loadingText: string;
}) {
  if (!loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center flex-col bg-black/40">
      <ClipLoader color="#899499" size={75} />
      <h1 className="mt-10 animate-pulse">{loadingText}</h1>
    </div>
  );
}
