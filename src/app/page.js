"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import HeaderComponent from "./components/HeaderComponent";
import Introduction from "./components/Introduction";
import Globe from "./components/Globe";
import FeatureSection from "./components/FeatureSection";
import Education from "./components/Education";
import Contact from "./components/Contact";
import data from "./data/profile.json";
import { IMAGES } from "./assets";

const BG =
  "radial-gradient(ellipse at 70% 10%, rgba(18,130,95,0.07) 0%, transparent 55%), #000";

const HATCH = {
  backgroundImage:
    "repeating-linear-gradient(45deg, #1f2937 0, #1f2937 1px, transparent 1px, transparent 8px)",
  backgroundSize: "8px 8px",
};

const INTERSECTION_HATCH = {
  backgroundImage: "repeating-linear-gradient(45deg, #374151 0, #374151 1px, transparent 1px, transparent 5px)",
  backgroundSize: "5px 5px",
};

function VerticalLines() {
  return (
    <div className="absolute inset-0 pointer-events-none hidden md:block">
      <div className="h-full px-[25%]">
        <div className="h-full border-x border-gray-800 px-8">
          <div className="h-full border-x border-gray-800" />
        </div>
      </div>
    </div>
  );
}

function EndDivider({ side }) {
  const isTop = side === "top";
  const topCorners = (
    // Pair-gap strips only: left gap (25% → 25%+32px) and right gap (75%-32px → 75%)
    <div className="relative h-[40px] hidden md:block">
      <div style={{ position: "absolute", left: "25%", width: 32, top: 0, bottom: 0, ...INTERSECTION_HATCH }} />
      <div style={{ position: "absolute", right: "25%", width: 32, top: 0, bottom: 0, ...INTERSECTION_HATCH }} />
    </div>
  );
  const botCorners = (
    <div className="relative h-5 hidden md:flex">
      <div className="w-[25%] h-full" style={HATCH} />
      <div className="flex-1" />
      <div className="w-[25%] h-full" style={HATCH} />
      <div style={{ position: "absolute", left: "25%", width: 32, top: 0, bottom: 0, ...INTERSECTION_HATCH }} />
      <div style={{ position: "absolute", left: "calc(75% - 32px)", width: 32, top: 0, bottom: 0, ...INTERSECTION_HATCH }} />
    </div>
  );
  const line = <div className="w-full border-t border-gray-800" />;
  return <div>{isTop ? <>{topCorners}{line}</> : <>{line}{botCorners}</>}</div>;
}

// Content-width separator — aligns with the inner content padding, not the full layout
function ContentDivider() {
  return (
    <div className="px-4 sm:px-8 md:px-[25%]">
      <div className="md:px-8">
        <div className="md:px-8">
          <div className="border-t border-gray-800" />
        </div>
      </div>
    </div>
  );
}

function SectionWrapper({ id, children }) {
  return (
    <div id={id} className="px-4 sm:px-8 md:px-[25%]">
      <div className="md:px-8">
        <div className="md:px-8">
          <div className="py-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

function TechStack() {
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <span className="text-white/30 text-[12px] tracking-[0.25em] uppercase font-medium">
        Tech Stack
      </span>
      <div className="w-full max-w-[560px] h-[420px] md:h-[520px]">
        <Globe />
      </div>
    </div>
  );
}

const SECTIONS = [
  { id: "about",     Component: () => <Introduction name={data.name} role={data.role} avatar={IMAGES[data.avatar]} /> },
  { id: "skills",    Component: TechStack },
  ...data.features.map((feature, i) => ({
    id: `feature-${i + 1}`,
    Component: () => (
      <FeatureSection
        title={feature.title}
        description={feature.description}
        image={IMAGES[feature.image]}
        imageAlt={feature.title}
        flip={feature.flip}
      />
    ),
  })),
  { id: "education", Component: Education },
  { id: "contact",   Component: Contact },
];

export default function Home() {
  return (
    <>
      <HeaderComponent />
      <ScrollArea className="h-[100vh]">
        <div className="relative min-h-screen" style={{ background: BG }}>
          <VerticalLines />

          <EndDivider side="top" />
          {SECTIONS.map(({ id, Component }, i) => (
            <React.Fragment key={id}>
              {i > 0 && <ContentDivider />}
              <SectionWrapper id={id}>
                <Component />
              </SectionWrapper>
            </React.Fragment>
          ))}
          <EndDivider side="bottom" />
        </div>
      </ScrollArea>
    </>
  );
}
