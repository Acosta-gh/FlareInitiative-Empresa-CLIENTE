"use client";
import { ArrowRight } from "lucide-react";
import { Fade } from "react-awesome-reveal";
import SectionHeader from "@/components/shared/SectionHeader";

const cards = [
  {
    badge: "Partner",
    badgeColor: "bg-brand-blue/10 text-brand-blue",
    accentBar: "bg-brand-blue",
    bg: "bg-gray-50/50",
    title: "Build With Us",
    description:
      "Collaborate on creating a secure, national suicide tracking system. We're looking for research institutions, mental health organizations, and government partners.",
    cta: "Get in Touch",
    ctaHref: "#contact",
    ctaStyle: "bg-brand-dark text-white hover:bg-brand-dark/85",
    disableCta: true,
  },
  {
    badge: "Donate",
    badgeColor: "bg-brand-orange/10 text-brand-orange",
    accentBar: "bg-brand-orange",
    bg: "bg-gray-50/50",
    title: "Support Our Mission",
    description:
      "Fund the database that will drive evidence-based prevention. Every contribution helps us build the infrastructure needed to save lives.",
    cta: "Donate Now",
    ctaHref: "https://www.zeffy.com/en-CA/donation-form/donate-to-help-first-responders-2",
    ctaStyle: "bg-brand-dark text-white hover:bg-brand-dark/85",
    disableCta: false,
    external: true,
  },
  {
    badge: "Advocate",
    badgeColor: "bg-brand-red/10 text-brand-red",
    accentBar: "bg-brand-red",
    bg: "bg-gray-50/50",
    title: "Spread Awareness",
    description:
      "Help bring visibility to this critical mental health issue. Share our mission, host a conversation, or engage your community.",
    cta: "Wear the Cause", 
    ctaHref: "https://store.flareinitiative.org/",
    ctaStyle: "bg-brand-dark text-white hover:bg-brand-dark/85",
    disableCta: false,
    external: true,

  },
];

export default function HowYouCanHelpSection() {
  return (
    <section id="help" className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <Fade triggerOnce duration={800}>
          <SectionHeader title="How You Can Help" />
          <p className="mt-4 text-brand-dark/50 font-brand text-base max-w-xl leading-relaxed">
            There are many ways to contribute — choose what resonates with you.
          </p>
          <div className="w-10 h-[2px] bg-brand-orange mt-6 mb-14" />
        </Fade>

        <div className="grid md:grid-cols-3 gap-2">
          {cards.map((card, index) => (
            <Fade key={index} triggerOnce duration={800} delay={index * 150}>
              <div
                className={`${card.bg} border border-brand-dark/[0.08] flex flex-col p-8 lg:p-10 h-full`}
              >
                <div className={`h-[3px] w-10 ${card.accentBar} mb-8`} />
                <span
                  className={`inline-block self-start px-3 py-1 text-xs font-bold rounded-full uppercase tracking-widest mb-6 ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold font-brand-heading leading-tight mb-4 text-brand-dark">
                  {card.title}
                </h3>
                <p className="font-brand text-sm leading-relaxed flex-grow mb-8 text-brand-dark/60">
                  {card.description}
                </p>

                {!card.disableCta && (
                  <a
                    href={card.ctaHref}
                    target={card.external ? "_blank" : undefined}
                    rel={card.external ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center gap-2 self-start px-6 py-3 text-xs font-semibold uppercase tracking-widest transition-colors duration-150 ${card.ctaStyle}`}
                  >
                    {card.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}