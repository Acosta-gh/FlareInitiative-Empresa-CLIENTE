"use client";
import { Fade, Slide, AttentionSeeker } from "react-awesome-reveal";
import { Heart, Target, Users, Shield, ArrowRight } from "lucide-react";
import Image from "next/image";
import firefighter from "@/assets/images/firefighter.webp";
import trio from "@/assets/images/threepeople.webp";
import police from "@/assets/images/police.webp";
import BackToHome from "@/components/shared/BackToHome";
import TeamSection from "@/components/about/TeamSection";

const values = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Visibility",
    description: "Bringing hidden numbers to light to drive meaningful systemic change.",
    color: "bg-brand-blue/10 text-brand-blue",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Precision",
    description: "Using evidence-based data to inform prevention strategies.",
    color: "bg-brand-red/10 text-brand-red",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community",
    description: "Bridging the gap between responders and the support they deserve.",
    color: "bg-brand-orange/10 text-brand-orange",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Compassion",
    description: "Reducing stigma and fostering a culture of mental health support.",
    color: "bg-brand-blue/10 text-brand-blue",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Sticky Header spacer */}
      <div className="pt-16 md:pt-24 pb-4">
        <div className="container mx-auto px-6 max-w-6xl">
          <Fade triggerOnce direction="down">
            <BackToHome />
          </Fade>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pb-12 pt-16 md:pb-16 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="max-w-3xl">
            <Fade triggerOnce duration={800}>
              <span className="text-brand-blue font-bold uppercase tracking-[0.3em] text-xs mb-6 block">Our Story</span>
              <h1 className="text-5xl md:text-7xl font-bold text-brand-dark font-brand-heading leading-[1.1] mb-8">
                Turning <span className="text-brand-red italic">Visibility</span> into Action.
              </h1>
              <p className="text-xl md:text-2xl text-brand-dark/60 font-brand leading-relaxed max-w-2xl">
                We are building Canada&apos;s first national database to break the silence on first responder suicide.
              </p>
            </Fade>
          </div>
        </div>
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f8f7f5] -z-10 translate-x-1/4 rounded-l-[100px] hidden lg:block"></div>
      </section>

      {/* Main Content */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            {/* Image Composition */}
            <div className="lg:col-span-6 relative">
              <div className="relative z-20">
                <Slide direction="left" triggerOnce duration={1000}>
                  <div className=" overflow-hidden shadow-2xl ">
                    <Image
                      src={firefighter}
                      alt="Firefighter in uniform"
                      className="w-full h-[500px] object-cover"
                      priority
                    />
                  </div>
                </Slide>
              </div>
              {/* Decorative elements */}
              <div className="absolute -left-12 -top-12 w-48 h-48 bg-brand-orange/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute right-0 top-1/2 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -z-10"></div>
            </div>

            {/* Text Content */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-6">
                <Fade triggerOnce cascade damping={0.1}>
                  <h2 className="text-3xl md:text-4xl font-bold text-brand-dark font-brand-heading leading-tight">
                    Addressing a critical gap in our national safety infrastructure.
                  </h2>
                  <p className="text-lg text-brand-dark/70 font-brand leading-relaxed">
                    The Flare Initiative was created after identifying a critical gap in Canada&apos;s approach to first responder mental health and suicide prevention: there is no national system dedicated to tracking first responder suicides.
                  </p>
                  <p className="text-lg text-brand-dark/70 font-brand leading-relaxed">
                    Without reliable data, it is difficult to understand the full scope of the issue, identify trends, recognize which occupations may be most affected, or ensure that mental health and suicide prevention programs are guided by evidence.
                  </p>
                  <p className="text-lg text-brand-dark/70 font-brand leading-relaxed">
                    The Flare Initiative is working to build a national first responder suicide database to help close that gap. By gathering and analyzing data, we aim to support mental health organizations, unions, agencies, and decision-makers with the evidence they need to strengthen prevention efforts and better support the psychological health and resilience of first responders.
                  </p>
                  <p className="text-lg text-brand-dark/70 font-brand leading-relaxed">
                    We are a federally incorporated nonprofit organization based in Alberta, with volunteers across Canada working toward one mission: reducing first responder suicides through data-driven prevention.
                  </p>
                </Fade>
              </div>

              {/*}
              <Fade triggerOnce delay={500}>
                <div className="bg-brand-blue/5 border-l-4 border-brand-blue p-8 rounded-r-2xl">
                  <p className="text-brand-dark font-bold text-xl leading-relaxed font-brand italic">
                    &quot;Our vision is a Canada where every first responder has access
                    to the mental health support they need, backed by data that drives
                    real change.&quot;
                  </p>
                </div>
              </Fade>
              */}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 md:py-32 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <Fade triggerOnce direction="up">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark font-brand-heading mb-6">Our Core Pillars</h2>
              <p className="text-brand-dark/60 font-brand text-lg">
                The principles that guide our work and drive our national mission.
              </p>
            </Fade>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Fade key={index} triggerOnce delay={index * 150} direction="up">
                <div className="p-8 rounded-3xl bg-[#f8f7f5] hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-gray-100 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${value.color}`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-4 font-brand-heading">{value.title}</h3>
                  <p className="text-brand-dark/60 font-brand leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      <TeamSection />

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-brand-dark text-white relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <Fade triggerOnce direction="up">
            <h2 className="text-4xl md:text-6xl font-bold font-brand-heading mb-8">Ready to help us break the silence?</h2>
            <p className="text-xl text-white/70 font-brand mb-12 max-w-2xl mx-auto">
              Join our mission to create visibility and drive systemic change for first responders across Canada.
            </p>
            <AttentionSeeker effect="pulse" triggerOnce delay={1000}>
              <a
                href="/#contact"
                className="bg-brand-orange hover:bg-brand-orange/90 text-brand-dark font-bold px-10 py-5 rounded-full inline-flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl"
              >
                Get Involved <ArrowRight className="w-5 h-5" />
              </a>
            </AttentionSeeker>
          </Fade>
        </div>
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-red rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-blue rounded-full blur-[120px]"></div>
        </div>
      </section>
    </main>
  );
}