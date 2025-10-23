import { Header, Footer } from "@/components/layout";
import { ErrorBoundary } from "@/components/error/error-boundary";
import {
  OfflineDetector,
  OfflineStatusIndicator,
} from "@/components/error/offline-detector";
import { LoadingProvider } from "@/components/loading/loading-manager";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <LoadingProvider>
        <OfflineDetector>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
            <Footer />
            <OfflineStatusIndicator />
          </div>
        </OfflineDetector>
      </LoadingProvider>
    </ErrorBoundary>
  );
}
