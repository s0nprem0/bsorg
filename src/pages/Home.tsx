import Hero from "@/components/sections/Hero";
import Section from "@/components/ui/Section";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
    <main className="grow">
      <Hero />
      <Section>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span>Featured Organizations</span>
          <Link
            to="/browse"
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Browse All Organizations
          </Link>
        </div>
      </Section>
    </main>
    </>
  );
}
