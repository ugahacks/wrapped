export type LanguageEntry = {
  name: string;
  percentage: number;
  color: string;
};

export type StatEntry = {
  number?: number | string;
  label: string;
  color: string;
};

export type StatSection = {
  title: string;
  stats: StatEntry[];
};

export type WrappedData = {
  meta: {
    eventName: string;
    title: string;
    dates: string;
    location: string;
    tagline: string;
    ctaLabel: string;
  };
  hero: {
    hint: string;
    thankYouLines: string[];
    statsSubtitle: string;
    statsTitle: string;
    statsSignoff: string;
  };
  particle: {
    title: string;
    count: number;
    gMorphColor: string;
    gMorphStart: number;
    languages: LanguageEntry[];
  };
  statsSections: StatSection[];
  overview: {
    title: string;
    cards: { label: string; value: string }[];
  };
  projects: {
    title: string;
    imageSrc: string;
    imageAlt: string;
    caption?: string;
  };
  workshops: {
    title: string;
    items: {
      name: string;
      attendees: number;
      host: string;
    }[];
  };
  highlights: {
    title: string;
    items: {
      label: string;
      value: string;
    }[];
  };
  repoHygiene: {
    title: string;
    subtitle: string;
    items: {
      fileType: string;
      count: number;
      description: string;
    }[];
  };
};
