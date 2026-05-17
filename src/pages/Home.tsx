import Hero from "@/components/sections/Hero";
import Marquee from "@/components/ui/Marquee";
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
             to="/organization"
             className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
           >
             Browse All Organizations
           </Link>
          <Marquee className="w-full" speed={100} text="Test Marquee" />
        </div>
      </Section>
    </main>
    </>
  );
}
