"use client";

export function ClientLoader({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-gray/10 backdrop-blur-sm">
      <Spinner />
    </div>
  );
}

function Spinner() {
  return (
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
  );
}
