"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FloatingCard } from "@/app/components/FloatingCard";
import { MarketingShell } from "@/app/components/MarketingShell";
import { PlanCard } from "@/app/components/PlanCard";
import { UpgradeButton } from "@/app/components/UpgradeButton";
import { planConfigs, siteConfig } from "@/app/lib/site";
import { ArrowUpRightIcon, BoltIcon, CalendarIcon, GaugeIcon, HashIcon, ShieldIcon, SparkIcon } from "./components/Icons";

const featureCards = [
  {
    title: "AI captions and hooks",
    content: "Generate launch-ready copy that sounds sharper than generic templates and still stays aligned to your audience and goal.",
    icon: <SparkIcon className="h-4 w-4" />,
  },
  {
    title: "Trending hashtag stacks",
    content: "Pair your niche with high-intent hashtags that support reach, discovery, and stronger post packaging.",
    icon: <HashIcon className="h-4 w-4" />,
  },
  {
    title: "Mini content calendars",
    content: "Turn one campaign goal into a compact five-day sequence so you always know what to post next.",
    icon: <CalendarIcon className="h-4 w-4" />,
  },
];

const trustItems = [
  {
    title: "Free daily runway",
    description: "Five generations every day gives you enough room to test angles before you spend.",
    icon: <GaugeIcon className="h-5 w-5" />,
  },
  {
    title: "Launch-beta Pro flow",
    description: "Upgrade with Stripe when you need unlimited output and faster campaign shipping.",
    icon: <BoltIcon className="h-5 w-5" />,
  },
  {
    title: "Small-business focused",
    description: "The messaging is tuned for local brands, service businesses, personal brands, and creators.",
    icon: <ShieldIcon className="h-5 w-5" />,
  },
];

export default function HomePage() {
  return (
    <MarketingShell>
      <section className="relative flex min-h-[72vh] flex-col justify-center">
        <div className="max-w-4xl space-y-8">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: "easeOut" }} className="space-y-6">
            <p className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100">
              Free plan included
            </p>
            <div className="space-y-4">
              <h1 className="max-w-4xl bg-gradient-to-r from-cyan-100 via-white to-pink-200 bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-7xl">
                {siteConfig.heroTitle}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">{siteConfig.heroSubtitle}</p>
              <p className="max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">{siteConfig.trustBadge}</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-400 to-pink-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_40px_rgba(97,231,255,0.28)] transition hover:translate-y-[-2px]"
              >
                Start Free
                <ArrowUpRightIcon className="h-4 w-4" />
              </Link>
              <UpgradeButton
                label="Unlock Pro"
                className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/35 hover:bg-cyan-400/10"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
            className="grid gap-4 pt-4 sm:grid-cols-3"
          >
            {[
              { value: "5/day", label: "Free generations per browser" },
              { value: "$29", label: "Pro launch price in USD" },
              { value: "4 outputs", label: "Caption, idea, hashtags, calendar" },
            ].map((stat) => (
              <div key={stat.label} className="glass-panel rounded-[24px] p-5">
                <p className="text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="pointer-events-none absolute inset-0">
          <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }} className="absolute left-[8%] top-[16%] h-28 w-28 rounded-full bg-cyan-400/15 blur-3xl" />
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY }} className="absolute right-[10%] top-[30%] h-32 w-32 rounded-full bg-pink-500/15 blur-3xl" />
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {featureCards.map((feature, index) => (
          <FloatingCard
            key={feature.title}
            title={feature.title}
            content={feature.content}
            icon={feature.icon}
            delay={index * 0.1}
            eyebrow="What you generate"
          />
        ))}
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Why it converts</p>
          <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-white">A fast funnel for getting from blank page to publish-ready content.</h2>
          <p className="max-w-2xl text-base leading-7 text-slate-300">
            AI Content Engine is built to make the first win feel immediate. You start free, generate real assets, then upgrade only when the free limit becomes too tight for your posting pace.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {trustItems.map((item) => (
              <div key={item.title} className="glass-panel rounded-[24px] p-5">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="glass-panel rounded-[32px] p-8"
        >
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Outcome preview</p>
          <h3 className="mt-4 text-2xl font-semibold text-white">Turn one business goal into a complete post package.</h3>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Caption</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">Make your audience feel like you read their mind, then guide them straight into a low-friction action.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Hook idea</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">Use a short visual transformation with a first-second hook that makes viewers stop and watch.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Mini calendar</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">Stretch a single campaign goal into five distinct daily post angles so your content feels consistent instead of repetitive.</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="space-y-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Pricing</p>
          <h2 className="text-4xl font-semibold tracking-tight text-white">Start with a real free tier, then move into Pro when your workflow needs more room.</h2>
          <p className="text-base leading-7 text-slate-300">{siteConfig.pricingBlurb}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {planConfigs.map((plan) => (
            <PlanCard key={plan.key} plan={plan} featured={plan.key === "pro"} />
          ))}
        </div>
      </section>

      <section className="glass-panel rounded-[36px] p-8 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Launch faster</p>
            <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-white">If the free limit helps you win, the Pro plan is ready when you are.</h2>
            <p className="max-w-2xl text-base leading-7 text-slate-300">
              Test content angles, learn what resonates, then unlock unlimited generation with the same dashboard flow. No complex onboarding, no bloated agency toolset, just faster social content output.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/35 hover:bg-cyan-400/10"
            >
              Try the Free Plan
            </Link>
            <UpgradeButton
              label="Go Pro for $29/month"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-400 to-pink-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(97,231,255,0.22)] transition hover:translate-y-[-1px]"
            />
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
