"use client";
import { Fade } from "react-awesome-reveal";
import { ArrowRight,ExternalLink } from "lucide-react";
import backgroundFirefighterImage from "@/assets/images/background.webp";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-end bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundFirefighterImage.src})`,
      }}
    >
      {/* Overlay sólido en la parte inferior, sin gradiente en el sentido estético */}
      <div className="absolute inset-0 bg-brand-dark/60" />

      {/* Línea vertical decorativa */}
      <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3 z-10">
        <div className="w-[1px] h-16 bg-white/20" />
        <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-brand" style={{ writingMode: "vertical-rl" }}>
          Est. 2026
        </p>
        <div className="w-[1px] h-16 bg-white/20" />
      </div>

      <div className="relative z-10 bottom-30 container mx-auto px-6 pb-20 md:pb-28 pt-40">
        <div className="max-w-3xl">
          <Fade triggerOnce duration={1000}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-orange font-brand mb-6">
              National First Responder Suicide Data Initiative
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.0] font-brand-heading mb-6">
              The Flare<br />Initiative
            </h1>
            <div className="w-12 h-[2px] bg-brand-orange mb-8" />
            <p className="text-lg text-white/70 leading-relaxed max-w-xl font-brand mb-10">
              Break the silence. Shining a light on first responder suicides
              through data-driven prevention and national visibility.
            </p>
            <a
              href="#about"
              className="inline-flex items-center gap-3 px-8 py-4 bg-brand-orange text-white font-semibold text-sm uppercase tracking-widest cursor-pointer"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </a>
              <a
              href="https://store.flareinitiative.org/"
              className="mt-2 inline-flex items-center gap-3 px-[1.95rem] py-3.5  text-brand-orange border-2  font-semibold text-sm uppercase tracking-widest cursor-pointer"
            >
              Support Us
              <ExternalLink className="w-4 h-4 " />
            </a>
          </Fade>
        </div>
      </div>
    </section>
  );
}