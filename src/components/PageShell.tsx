import Image from "next/image";

interface PageShellProps {
  children: React.ReactNode;
  darkOverlay?: boolean;
}

export default function PageShell({ children, darkOverlay = true }: PageShellProps) {
  return (
    <div className="min-h-screen relative bg-[#0a0a0a]">
      <Image
        src="/backdrop.png"
        alt=""
        fill
        className="object-cover fixed inset-0 pointer-events-none opacity-50"
        priority
      />
      {darkOverlay && (
        <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
