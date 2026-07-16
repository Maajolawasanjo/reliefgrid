import React from 'react';
import { Metadata } from 'next';
import { LandingNavbar } from '@/components/landing/Navbar';
import { LandingHero } from '@/components/landing/Hero';
import { LandingProblem } from '@/components/landing/Problem';
import { LandingSolution } from '@/components/landing/Solution';
import { LandingAgents } from '@/components/landing/Agents';
import { LandingMemory } from '@/components/landing/Memory';
import { LandingGIS } from '@/components/landing/GIS';
import { LandingTechnology } from '@/components/landing/Technology';
import { LandingArchitecture } from '@/components/landing/Architecture';
import { LandingWhyCockroachDB } from '@/components/landing/WhyCockroachDB';
import { LandingFeatures } from '@/components/landing/Features';
import { LandingFAQ } from '@/components/landing/FAQ';
import { LandingCTA } from '@/components/landing/CTA';
import { LandingFooter } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'ReliefGrid — Autonomous AI Emergency Response Platform Powered by Memory',
  description: 'Mission-critical autonomous multi-agent disaster response platform powered by CockroachDB vector recall and AWS Bedrock reasoning engine.',
  openGraph: {
    title: 'ReliefGrid — Autonomous Emergency Response Platform Engine',
    description: 'Recalls historical crisis decisions to optimize emergency dispatch.',
    type: 'website',
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-[#00D2FF]/20 selection:text-[#1C3D5A]">
      {/* Sticky Header Navigation */}
      <LandingNavbar />

      {/* Main Sections Composition */}
      <main>
        {/* Section 1: Hero */}
        <LandingHero />

        {/* Section 2: The Problem */}
        <LandingProblem />

        {/* Section 3: The Solution Pipeline */}
        <LandingSolution />

        {/* Section 4: 6 Specialist Agents */}
        <LandingAgents />

        {/* Section 5: Collective Memory (HERO FEATURE) */}
        <LandingMemory />

        {/* Section 6: Interactive GIS Experience */}
        <LandingGIS />

        {/* Section 7: Technology Stack */}
        <LandingTechnology />

        {/* Section 8: Interactive Architecture Diagram */}
        <LandingArchitecture />

        {/* Section 9: Why CockroachDB */}
        <LandingWhyCockroachDB />

        {/* Section 10: Features Grid */}
        <LandingFeatures />

        {/* Section 11: Enterprise Technical FAQ */}
        <LandingFAQ />

        {/* Section 12: Final CTA Banner */}
        <LandingCTA />
      </main>

      {/* Enterprise Footer */}
      <LandingFooter />
    </div>
  );
}
