interface PageShellProps {
  children: React.ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen relative bg-black">
      <div className="relative z-10">{children}</div>
    </div>
  );
}
