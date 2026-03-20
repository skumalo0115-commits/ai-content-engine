import { MarketingShell } from "@/app/components/MarketingShell";
import { PlanCard } from "@/app/components/PlanCard";
import { planConfigs, siteConfig } from "@/app/lib/site";

export default function PricingPage() {
  return (
    <MarketingShell>
      <section className="space-y-6 pt-8">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Pricing</p>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white">Start free, move into Pro when the daily cap stops being enough.</h1>
        <p className="max-w-3xl text-base leading-7 text-slate-300">{siteConfig.pricingBlurb}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {planConfigs.map((plan) => (
          <PlanCard key={plan.key} plan={plan} featured={plan.key === "pro"} />
        ))}
      </section>

      <section className="glass-panel rounded-[32px] p-8">
        <h2 className="text-2xl font-semibold text-white">What happens after checkout?</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          In this launch build, successful Stripe checkout unlocks Pro on the same browser you return to. That keeps the flow simple for localhost testing while still giving you a working upgrade path.
        </p>
      </section>
    </MarketingShell>
  );
}
