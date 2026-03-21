"use client";

import Link from "next/link";
import { FloatingCard } from "@/app/components/FloatingCard";
import { MarketingShell } from "@/app/components/MarketingShell";
import { PlanCard } from "@/app/components/PlanCard";
import { Reveal } from "@/app/components/Reveal";
import { SelfieHeroScene } from "@/app/components/SelfieHeroScene";
import { UpgradeButton } from "@/app/components/UpgradeButton";
import { planConfigs, siteConfig } from "@/app/lib/site";
import { ArrowUpRightIcon, BoltIcon, CalendarIcon, GaugeIcon, HashIcon, ShieldIcon, SparkIcon } from "./components/Icons";

const featureCards = [
  {
    title: "Captions with structure",
    content: "Get clear, composed copy that sounds campaign-ready instead of over-automated.",
    icon: <SparkIcon className="h-4 w-4" />,
  },
  {
    title: "Hashtags with intent",
    content: "Build cleaner hashtag stacks that support reach without drowning the message.",
    icon: <HashIcon className="h-4 w-4" />,
  },
  {
    title: "Posting rhythm built in",
    content: "Stretch one content objective into a five-day content rhythm that stays focused.",
    icon: <CalendarIcon className="h-4 w-4" />,
  },
];

const principleCards = [
  {
    title: "Minimal by design",
    description: "The interface is intentionally calm so the content work feels clearer and more professional.",
    icon: <ShieldIcon className="h-5 w-5" />,
  },
  {
    title: "Daily free runway",
    description: "Five generations every day gives you enough space to test before paying.",
    icon: <GaugeIcon className="h-5 w-5" />,
  },
  {
    title: "Upgrade only when needed",
    description: "Move into Pro when the pace of your content starts outgrowing the free cap.",
    icon: <BoltIcon className="h-5 w-5" />,
  },
];

export default function HomePage() {
  return (
    <MarketingShell>
      <section className="grid min-h-[76vh] gap-14 pt-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <Reveal className="space-y-7">
          <div className="space-y-4">
            <p className="editorial-label text-xs">Editorial AI Content Studio</p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-[#181614] sm:text-7xl">{siteConfig.heroTitle}</h1>
            <p className="max-w-2xl text-lg leading-8 text-[#5f584f] sm:text-xl">{siteConfig.heroSubtitle}</p>
            <p className="max-w-2xl text-sm leading-7 text-[#7a7269] sm:text-base">{siteConfig.trustBadge}</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#181614] px-6 py-3 text-sm font-semibold text-[#f8f4ee] transition hover:bg-[#2b2723]">
              Start Free
              <ArrowUpRightIcon className="h-4 w-4" />
            </Link>
            <UpgradeButton
              label="Upgrade to Pro"
              className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-6 py-3 text-sm font-semibold text-[#181614] transition hover:border-[#20584f]/20 hover:text-[#20584f]"
            />
          </div>

          <div className="section-rule" />

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: "5/day", label: "Free generations" },
              { value: "$29", label: "Pro monthly plan" },
              { value: "Live + demo", label: "Works with or without API keys" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[1.6rem] border border-black/6 bg-white/85 p-5 shadow-[0_18px_40px_rgba(24,22,20,0.05)]">
                <p className="text-3xl font-semibold text-[#181614]">{stat.value}</p>
                <p className="mt-2 text-sm text-[#6f685f]">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <SelfieHeroScene />
        </Reveal>
      </section>

      <Reveal className="space-y-8">
        <div className="max-w-3xl space-y-4">
          <p className="editorial-label text-xs">What it gives you</p>
          <h2 className="text-4xl font-semibold tracking-tight text-[#181614]">A cleaner way to turn one idea into content that looks ready to publish.</h2>
          <p className="max-w-2xl text-base leading-7 text-[#5f584f]">
            The product is now built around restraint: fewer visual distractions, clearer hierarchy, and motion that supports the message instead of overwhelming it.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featureCards.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.06}>
              <FloatingCard title={feature.title} content={feature.content} icon={feature.icon} eyebrow="Core output" />
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-start">
        <div className="space-y-5">
          <p className="editorial-label text-xs">How the redesign works</p>
          <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-[#181614]">The landing page now behaves more like a premium editorial brand site than a loud SaaS demo.</h2>
          <p className="max-w-2xl text-base leading-7 text-[#5f584f]">
            The selfie animation gives the page a signature moment, but the surrounding system stays restrained: off-white surfaces, darker typography, controlled accents, and reveal motion as you move through sections.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {principleCards.map((item) => (
              <div key={item.title} className="rounded-[1.6rem] border border-black/6 bg-white p-5 shadow-[0_18px_40px_rgba(24,22,20,0.05)]">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e6efeb] text-[#20584f]">{item.icon}</div>
                <h3 className="mt-4 text-lg font-semibold text-[#181614]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6f685f]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[2rem] border border-black/6 bg-white p-8 shadow-[0_20px_48px_rgba(24,22,20,0.06)]">
          <p className="editorial-label text-xs">Flow</p>
          <div className="space-y-5">
            {[
              {
                step: "01",
                title: "Describe the business and the goal",
                text: "Give the dashboard a sharp brief so the output stays useful instead of generic.",
              },
              {
                step: "02",
                title: "Generate a content pack",
                text: "Receive a caption, hook idea, hashtag set, and a short posting rhythm in one go.",
              },
              {
                step: "03",
                title: "Upgrade when momentum starts",
                text: "Use the free plan for daily testing, then unlock Pro when your content cadence increases.",
              },
            ].map((item) => (
              <div key={item.step} className="grid gap-3 border-b border-black/6 pb-5 last:border-b-0 last:pb-0 sm:grid-cols-[70px_1fr]">
                <p className="text-sm font-semibold text-[#20584f]">{item.step}</p>
                <div>
                  <h3 className="text-lg font-semibold text-[#181614]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6f685f]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="space-y-8">
        <div className="max-w-3xl space-y-4">
          <p className="editorial-label text-xs">Pricing</p>
          <h2 className="text-4xl font-semibold tracking-tight text-[#181614]">Free for daily testing. Pro when you want to remove the cap and move faster.</h2>
          <p className="text-base leading-7 text-[#5f584f]">{siteConfig.pricingBlurb}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {planConfigs.map((plan, index) => (
            <Reveal key={plan.key} delay={index * 0.06}>
              <PlanCard plan={plan} featured={plan.key === "pro"} />
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal className="rounded-[2.3rem] border border-black/6 bg-white px-8 py-10 shadow-[0_24px_58px_rgba(24,22,20,0.06)] sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <p className="editorial-label text-xs">Ready when you are</p>
            <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-[#181614]">A calmer, more professional product surface with motion that still feels alive.</h2>
            <p className="max-w-2xl text-base leading-7 text-[#5f584f]">
              The landing page now leads with character, the dashboard keeps the work clear, and the entire product feels more composed from top to bottom.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
            <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-6 py-3 text-sm font-semibold text-[#181614] transition hover:border-[#20584f]/20 hover:text-[#20584f]">
              Try the New Free Plan
            </Link>
            <UpgradeButton label="Go Pro for $29/month" className="inline-flex items-center justify-center rounded-full bg-[#181614] px-6 py-3 text-sm font-semibold text-[#f8f4ee] transition hover:bg-[#2b2723]" />
          </div>
        </div>
      </Reveal>
    </MarketingShell>
  );
}
