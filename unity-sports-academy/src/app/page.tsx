import { Hero } from "@/components/Hero";
import { AboutPreview } from "@/components/AboutPreview";
import { ProgramsSection } from "@/components/ProgramsSection";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { MatchCenter } from "@/components/MatchCenter";
import { PlayerOfTheMonth } from "@/components/PlayerOfTheMonth";
import { Testimonials } from "@/components/Testimonials";
import { NewsSection } from "@/components/NewsSection";
import { CallToAction } from "@/components/CallToAction";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <AboutPreview />
      <ProgramsSection />
      <WhyChooseUs />
      <MatchCenter />
      <PlayerOfTheMonth />
      <Testimonials />
      <NewsSection />
      <CallToAction />
    </div>
  );
}
