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
        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-[#181614]">Start free, move into Pro when your free account limit stops being enough.</h1>
        <p className="max-w-3xl text-base leading-7 text-[#5f584f]">{siteConfig.pricingBlurb}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {planConfigs.map((plan) => (
          <PlanCard key={plan.key} plan={plan} featured={plan.key === "pro"} />
        ))}
      </section>

      <section className="glass-panel rounded-[32px] p-8">
        <h2 className="text-2xl font-semibold text-[#181614]">What Pro unlocks right now</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5f584f]">
          The Pro card now starts the real Paystack subscription checkout flow. Once the first payment is approved, Pro unlocks on this browser and the premium features start working immediately, including the saved-content schedule builder and the 14-day AI calendar.
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f584f]">
          When a user opens the subscription management flow from Paystack, they can cancel future deductions there. Previous successful payments are not refundable.
        </p>
      </section>

      <section className="glass-panel rounded-[32px] p-8">
        <h2 className="text-2xl font-semibold text-[#181614]">How the live subscription flow will work</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            ["01", "Choose Pro", "The customer lands on the pricing page and starts the monthly subscription."],
            ["02", "Pay securely", "They enter a debit or credit card in Paystack's hosted checkout flow and review the monthly amount."],
            ["03", "Approve subscription", "Once the first payment succeeds, Pro features unlock and future monthly charges continue automatically."],
            ["04", "Manage or cancel", "From the Paystack subscription area, the customer can cancel future deductions while previous successful payments stay non-refundable."],
          ].map(([step, title, text]) => (
            <div key={step} className="rounded-[24px] border border-black/6 bg-white/85 p-5">
              <p className="text-sm font-semibold text-[#20584f]">{step}</p>
              <h3 className="mt-3 text-lg font-semibold text-[#181614]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#5f584f]">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
