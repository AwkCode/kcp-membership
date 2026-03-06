import Image from "next/image";
import BackgroundCarousel from "./BackgroundCarousel";

interface PageShellProps {
  children: React.ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen relative bg-kc-gradient overflow-hidden">
      {/* Background photo carousel */}
      <BackgroundCarousel />

      {/* Side art - left (mobile: small corner pieces, desktop: larger) */}
      <div className="fixed left-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 xl:w-40 z-[2] pointer-events-none">
        <div className="absolute top-[12%] -left-6 sm:-left-4 lg:-left-4 xl:left-0 opacity-[0.06] sm:opacity-[0.08] lg:opacity-[0.10]">
          <Image
            src="/art/osn-1.png"
            alt=""
            width={160}
            height={160}
            className="w-20 sm:w-28 lg:w-40 rotate-[-8deg]"
            aria-hidden="true"
          />
        </div>
        <div className="absolute top-[55%] -left-5 sm:-left-3 lg:-left-2 xl:left-2 opacity-[0.05] sm:opacity-[0.07] lg:opacity-[0.09]">
          <Image
            src="/art/shc.png"
            alt=""
            width={130}
            height={130}
            className="w-16 sm:w-24 lg:w-[130px] rotate-[5deg]"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Side art - right (mobile: small corner pieces, desktop: larger) */}
      <div className="fixed right-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 xl:w-40 z-[2] pointer-events-none">
        <div className="absolute top-[25%] -right-6 sm:-right-4 lg:-right-4 xl:right-0 opacity-[0.06] sm:opacity-[0.08] lg:opacity-[0.10]">
          <Image
            src="/art/kctv.png"
            alt=""
            width={140}
            height={140}
            className="w-20 sm:w-28 lg:w-[140px] rotate-[10deg]"
            aria-hidden="true"
          />
        </div>
        <div className="absolute top-[68%] -right-5 sm:-right-3 lg:-right-2 xl:right-2 opacity-[0.05] sm:opacity-[0.07] lg:opacity-[0.09]">
          <Image
            src="/art/osn-2.png"
            alt=""
            width={150}
            height={150}
            className="w-16 sm:w-24 lg:w-[150px] rotate-[-6deg]"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Page content with fade-in */}
      <div className="relative z-10 animate-page-in">{children}</div>
    </div>
  );
}
