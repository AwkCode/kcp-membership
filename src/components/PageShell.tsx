import Image from "next/image";

interface PageShellProps {
  children: React.ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen relative bg-kc-gradient overflow-hidden">
      {/* Side art - left */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-32 xl:w-40 z-[1] pointer-events-none">
        <div className="absolute top-[15%] -left-4 xl:left-0 opacity-[0.07] hover:opacity-[0.12] transition-opacity duration-700">
          <Image
            src="/art/osn-1.png"
            alt=""
            width={160}
            height={160}
            className="rotate-[-8deg]"
            aria-hidden="true"
          />
        </div>
        <div className="absolute top-[55%] -left-2 xl:left-2 opacity-[0.06] hover:opacity-[0.11] transition-opacity duration-700">
          <Image
            src="/art/shc.png"
            alt=""
            width={130}
            height={130}
            className="rotate-[5deg]"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Side art - right */}
      <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-32 xl:w-40 z-[1] pointer-events-none">
        <div className="absolute top-[25%] -right-4 xl:right-0 opacity-[0.07] hover:opacity-[0.12] transition-opacity duration-700">
          <Image
            src="/art/kctv.png"
            alt=""
            width={140}
            height={140}
            className="rotate-[10deg]"
            aria-hidden="true"
          />
        </div>
        <div className="absolute top-[65%] -right-2 xl:right-2 opacity-[0.06] hover:opacity-[0.11] transition-opacity duration-700">
          <Image
            src="/art/osn-2.png"
            alt=""
            width={150}
            height={150}
            className="rotate-[-6deg]"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Page content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
