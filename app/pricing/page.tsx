import { MarketingShell } from "@/app/components/MarketingShell";
import { PlanCard } from "@/app/components/PlanCard";
import { planConfigs, siteConfig } from "@/app/lib/site";

export default function PricingPage() {
  return (
    <MarketingShell>
      <div
        className="pointer-events-none fixed inset-0 -z-[9] bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-slide-4.png')" }}
      />
      <div className="pointer-events-none fixed inset-0 -z-[8] bg-[rgba(244,240,232,0.84)]" />
      <section className="space-y-6 pt-8">
        <p className="editorial-label text-xs">Pricing</p>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-[#181614]">Start free, move into Pro when the daily cap stops being enough.</h1>
        <p className="max-w-3xl text-base leading-7 text-[#5f584f]">{siteConfig.pricingBlurb}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {planConfigs.map((plan) => (
          <PlanCard key={plan.key} plan={plan} featured={plan.key === "pro"} />
        ))}
      </section>

      <section className="glass-panel rounded-[32px] p-8">
        <h2 className="text-2xl font-semibold text-[#181614]">What happens after checkout?</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5f584f]">
          In this launch build, successful Stripe checkout unlocks Pro on the same browser you return to. That keeps the flow simple for localhost testing while still giving you a working upgrade path.
        </p>
      </section>
    </MarketingShell>
  );
}
