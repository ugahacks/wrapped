"use client";

import { useEffect, useMemo, useState } from "react";

import { HighlightsSection } from "@/components/wrapped/highlights-section";
import { HeroOverlay } from "@/components/wrapped/hero-overlay";
import { LanguagesSection } from "@/components/wrapped/languages-section";
import { OverviewSection } from "@/components/wrapped/overview-section";
import { ProgressBar } from "@/components/wrapped/progress-bar";
import { ProjectsSection } from "@/components/wrapped/projects-section";
import { RepoHygieneSection } from "@/components/wrapped/repo-hygiene-section";
import { StatsOverlay } from "@/components/wrapped/stats-overlay";
import { ThankYouOverlay } from "@/components/wrapped/thank-you-overlay";
import { WorkshopsSection } from "@/components/wrapped/workshops-section";
import { ParticleCanvas } from "@/components/particles/particle-canvas";
import { UgaGReference } from "@/components/particles/uga-g-reference";
import type { WrappedData } from "@/types/wrapped";

type WrappedAppProps = {
  data: WrappedData;
};

type ScrollState = {
  overall: number;
  morph: number;
  thankYou: number;
  stats: number;
  statsScroll: number;
  statsExit: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function easeInOutCubic(t: number) {
  if (t <= 0.5) {
    return 4 * t * t * t;
  }
  return 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function computeScrollState(): ScrollState {
  const scrollY = window.scrollY;
  const viewport = window.innerHeight;
  const max = Math.max(1, document.documentElement.scrollHeight - viewport);

  return {
    overall: clamp(scrollY / max, 0, 1),
    morph: clamp(scrollY / viewport, 0, 1),
    thankYou: clamp((scrollY - viewport) / viewport, 0, 1),
    stats: clamp((scrollY - viewport * 1.5) / (viewport * 0.6), 0, 1),
    // Scroll through stats content: starts after reveal (2.1vh), ends before exit (3.5vh)
    statsScroll: clamp((scrollY - viewport * 2.1) / (viewport * 1.4), 0, 1),
    // Stats exit animation
    statsExit: clamp((scrollY - viewport * 3.5) / (viewport * 0.5), 0, 1)
  };
}

export function WrappedApp({ data }: WrappedAppProps) {
  const [scroll, setScroll] = useState<ScrollState>({
    overall: 0,
    morph: 0,
    thankYou: 0,
    stats: 0,
    statsScroll: 0,
    statsExit: 0
  });

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        setScroll(computeScrollState());
        frame = 0;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const heroOpacity = useMemo(() => {
    if (scroll.morph < 0.15) {
      return 1;
    }

    if (scroll.morph > 0.45) {
      return 0;
    }

    return 1 - (scroll.morph - 0.15) / 0.3;
  }, [scroll.morph]);

  const thankYouFadeOut = easeInOutCubic(Math.min(1, scroll.stats / 0.22));
  const statsRevealProgress = easeInOutCubic(Math.max(0, (scroll.stats - 0.2) / 0.8));
  const statsLiftProgress = easeInOutCubic(scroll.statsExit);
  const statsVisibility = statsRevealProgress * (1 - statsLiftProgress);

  return (
    <main className="relative min-h-[620vh] overflow-x-clip bg-magic text-cream">
      <ProgressBar progress={scroll.overall} />
      <ParticleCanvas
        count={data.particle.count}
        languages={data.particle.languages}
        gMorphColor={data.particle.gMorphColor}
        gMorphStart={data.particle.gMorphStart}
        morphProgress={scroll.morph}
        calmProgress={scroll.thankYou}
      />
      <UgaGReference />

      <div className="pointer-events-none fixed inset-0 z-20 bg-vignette" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 z-20 bg-grain opacity-25" aria-hidden="true" />

      <HeroOverlay
        title={data.meta.title}
        dates={data.meta.dates}
        location={data.meta.location}
        tagline={data.meta.tagline}
        ctaLabel={data.meta.ctaLabel}
        opacity={heroOpacity}
      />

      <p
        className="pointer-events-none fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full border border-periwinkle/40 bg-indigo/35 px-4 py-2 text-xs uppercase tracking-[0.18em] text-periwinkle backdrop-blur"
        style={{ opacity: scroll.morph >= 0.95 && scroll.thankYou < 0.9 ? 1 : 0 }}
      >
        {data.hero.hint}
      </p>

      <ThankYouOverlay
        lines={data.hero.thankYouLines}
        opacity={scroll.thankYou * (1 - thankYouFadeOut)}
        lineProgress={scroll.thankYou}
      />

      <StatsOverlay
        subtitle={data.hero.statsSubtitle}
        title={data.hero.statsTitle}
        signoff={data.hero.statsSignoff}
        sections={data.statsSections}
        revealProgress={statsRevealProgress}
        visibility={statsVisibility}
        liftProgress={statsLiftProgress}
        scrollProgress={scroll.statsScroll}
      />

      <div className="relative z-[45] mx-auto max-w-4xl space-y-5 px-4 pb-16 pt-[500vh] md:space-y-6 md:px-6">
        <OverviewSection title={data.overview.title} cards={data.overview.cards} />
        <LanguagesSection title={data.particle.title} items={data.particle.languages} />
        <ProjectsSection
          title={data.projects.title}
          imageSrc={data.projects.imageSrc}
          imageAlt={data.projects.imageAlt}
          caption={data.projects.caption}
        />
        <WorkshopsSection title={data.workshops.title} items={data.workshops.items} />
        <RepoHygieneSection
          title={data.repoHygiene.title}
          subtitle={data.repoHygiene.subtitle}
          items={data.repoHygiene.items}
        />
        <HighlightsSection title={data.highlights.title} items={data.highlights.items} />
      </div>
    </main>
  );
}
