import { CVBuilder } from "@/components/cv-builder";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fdf2ec_0%,#f8f1ec_34%,#efe8e0_100%)] px-4 py-6 text-stone-900 sm:px-6 lg:px-8">
      <CVBuilder />
    </main>
  );
}
