import LoaderOverlay from "@/components/ui/loader-overlay";

export default function LoadingScreen() {
  return (
    <LoaderOverlay
      loading={true}
      loadingText="Please wait while we ready up..."
    />
  );
}
