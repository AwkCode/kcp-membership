// Kings Court Boston - Join Page
import Header from "@/components/Header";
import PageShell from "@/components/PageShell";
import { DoodleScatter } from "@/components/Doodles";
import MembershipForm from "@/components/MembershipForm";

export default function JoinPage() {
  return (
    <PageShell>
      <Header />
      <DoodleScatter variant="join" />
      <main className="flex flex-col items-center px-6 pt-12 pb-24">
        <MembershipForm />
      </main>
    </PageShell>
  );
}
