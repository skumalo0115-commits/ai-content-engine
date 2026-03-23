"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
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
    title: "Know what to post next",
    description: "Use one business goal to map out your next caption, video angle, hashtags, and posting rhythm.",
    icon: <ShieldIcon className="h-5 w-5" />,
  },
  {
    title: "Test ideas before you film",
    description: "Try a few directions on the free plan first so you waste less time shooting content that misses.",
    icon: <GaugeIcon className="h-5 w-5" />,
  },
  {
    title: "Scale when the pace increases",
    description: "Upgrade only when you need more daily output or want to move through campaigns faster.",
    icon: <BoltIcon className="h-5 w-5" />,
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user, runAuthenticated } = useAuth();

  const openDashboard = () => {
    if (user) {
      router.push("/dashboard");
      return;
    }

    runAuthenticated({ redirectTo: "/dashboard" });
  };

  return (
    <MarketingShell>
      <div
        className="pointer-events-none fixed inset-0 -z-[9] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i0.wp.com/read.crowdfireapp.com/wp-content/uploads/2022/03/Content-Diversification_-8-Social-Media-Content-Types-and-How-to-Use-Them.png?fit=675%2C450&ssl=1')",
        }}
      />
      <div className="pointer-events-none fixed inset-0 -z-[8] bg-[rgba(10,17,32,0.58)]" />
      <section className="relative grid min-h-[76vh] gap-14 overflow-hidden rounded-[2.4rem] pt-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <Reveal className="space-y-7">
          <div className="relative space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/78">Editorial AI Content Studio</p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-7xl">{siteConfig.heroTitle}</h1>
            <p className="max-w-2xl text-lg leading-8 text-white/86 sm:text-xl">{siteConfig.heroSubtitle}</p>
            <p className="max-w-2xl text-sm leading-7 text-white/72 sm:text-base">{siteConfig.trustBadge}</p>
          </div>

          <div className="relative flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={openDashboard}
              className="interactive-pop inline-flex items-center justify-center gap-2 rounded-full bg-[#181614] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2b2723]"
            >
              <span className="relative z-[1] text-white">{user ? "Dashboard" : "Start Free"}</span>
              <ArrowUpRightIcon className="relative z-[1] h-4 w-4 text-white" />
            </button>
            <UpgradeButton
              label="Upgrade to Pro"
              className="interactive-pop inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-6 py-3 text-sm font-semibold text-[#181614] hover:border-[#20584f]/20 hover:text-[#181614]"
            />
          </div>

          <div className="relative section-rule" />

          <div className="relative grid gap-4 sm:grid-cols-3">
            {[
              { value: "5/day", label: "Free generations" },
              { value: "$29", label: "Pro monthly plan" },
              { value: "Live only", label: "Runs through OpenRouter with real output" },
            ].map((stat) => (
              <div key={stat.label} className="interactive-pop rounded-[1.6rem] border border-black/6 bg-white/85 p-5 shadow-[0_18px_40px_rgba(24,22,20,0.05)]">
                <p className="text-3xl font-semibold text-[#181614]">{stat.value}</p>
                <p className="mt-2 text-sm text-[#6f685f]">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="relative lg:-translate-y-5" delay={0.08}>
          <SelfieHeroScene />
        </Reveal>
      </section>

      <Reveal className="space-y-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/78">What it gives you</p>
          <h2 className="text-4xl font-semibold tracking-tight text-white">A cleaner way to turn one idea into content that looks ready to publish.</h2>
          <p className="max-w-2xl text-base leading-7 text-white/82">
            Tell it what you sell, who you want to reach, and what result you want. It gives you a usable caption angle, a short-form content idea, a cleaner hashtag set, and a simple next-post rhythm you can actually work from.
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
          <p className="text-xs uppercase tracking-[0.3em] text-white/78">Why this helps you</p>
          <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-white">Use the free plan to plan smarter content before you spend time filming, designing, or posting.</h2>
          <p className="max-w-2xl text-base leading-7 text-white/82">
            Instead of guessing what to post, you can walk away with a clearer caption angle, a short-form video hook, a useful hashtag set, and a simple posting direction that fits your goal.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {principleCards.map((item) => (
              <div key={item.title} className="interactive-pop rounded-[1.6rem] border border-black/6 bg-white p-5 shadow-[0_18px_40px_rgba(24,22,20,0.05)]">
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
                text: "Give the tool a short, focused brief so the results are tailored to your business and audience.",
              },
              {
                step: "02",
                title: "Generate a content pack",
                text: "Get a caption, a video idea, hashtags, and a mini posting plan in one clean batch.",
              },
              {
                step: "03",
                title: "Move from DIY testing to faster output",
                text: "Stay on the free plan while you test, then unlock Pro when you need more than the daily cap.",
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
          <p className="text-xs uppercase tracking-[0.3em] text-white/78">Pricing</p>
          <h2 className="text-4xl font-semibold tracking-tight text-white">Free for daily testing. Pro when you want to remove the cap and move faster.</h2>
          <p className="text-base leading-7 text-white/82">{siteConfig.pricingBlurb}</p>
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
            <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-[#181614]">Start with tomorrow&apos;s post, then build the rest of the week from there.</h2>
            <p className="max-w-2xl text-base leading-7 text-[#5f584f]">
              Use the free plan to test a caption direction, pull a reel hook, and line up your next few posts before you open Canva, set up your tripod, or record your first clip.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
            <button
              type="button"
              onClick={openDashboard}
              className="interactive-pop inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-6 py-3 text-sm font-semibold text-[#181614] hover:border-[#20584f]/20 hover:text-[#181614]"
            >
              <span className="relative z-[1]">{user ? "Open Dashboard" : "Try the New Free Plan"}</span>
            </button>
            <UpgradeButton label="Go Pro for $29/month" className="interactive-pop inline-flex items-center justify-center rounded-full bg-[#181614] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2b2723]" />
          </div>
        </div>
      </Reveal>
    </MarketingShell>
  );
}
