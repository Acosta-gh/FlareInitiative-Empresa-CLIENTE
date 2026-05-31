export const revalidate = 3600;

import dynamic from 'next/dynamic';
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import MissionSection from "@/components/home/MissionSection";
import EventPopup from "@/components/EventPopup";

const StatsSection = dynamic(() => import('@/components/home/StatsSection'), {
  loading: () => <div className="py-20 md:py-28 bg-[#f8f7f5]" />,
});

const ApproachSection = dynamic(() => import('@/components/home/ApproachSection'), {
  loading: () => <div className="py-20 md:py-28 bg-white" />,
});

const HowYouCanHelpSection = dynamic(() => import('@/components/home/HowYouCanHelpSection'), {
  loading: () => <div className="py-20 md:py-28 bg-brand-dark" />,
});

const ContactSection = dynamic(() => import('@/components/home/ContactSection'), {
  loading: () => <div className="py-20 md:py-28 bg-white" />,
});

const CrisisSupportSection = dynamic(() => import('@/components/home/CrisisSupportSection'), {
  loading: () => <div className="py-16 md:py-20 bg-brand-dark" />,
});

export default function HomePage() {
  return (
    <>
      <EventPopup />
      <HeroSection />
      <AboutSection />
      <MissionSection />
      <StatsSection />
      <ApproachSection />
      <HowYouCanHelpSection />
      <ContactSection />
      <CrisisSupportSection />
    </>
  );
}