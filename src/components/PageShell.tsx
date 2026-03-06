import BackgroundCarousel from "./BackgroundCarousel";

interface PageShellProps {
  children: React.ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen relative bg-kc-gradient overflow-hidden">
      {/* Background photo carousel */}
      <BackgroundCarousel />

      {/* Page content with fade-in */}
      <div className="relative z-10 animate-page-in">{children}</div>
    </div>
  );
}
