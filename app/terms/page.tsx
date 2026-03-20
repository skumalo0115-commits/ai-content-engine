import { MarketingShell } from "@/app/components/MarketingShell";
import { PRO_MONTHLY_PRICE_USD, siteConfig } from "@/app/lib/site";

export default function TermsPage() {
  return (
    <MarketingShell>
      <section className="space-y-6 pt-8">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Terms of Service</p>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white">Starter terms for using {siteConfig.name}.</h1>
      </section>

      <section className="space-y-4">
        <article className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-white">Service access</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">The app is provided on an as-available basis during this launch phase. Features, limits, and pricing may evolve as the product matures.</p>
        </article>
        <article className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-white">Free and Pro plans</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">The free plan includes five generations per day per browser. Pro is offered at ${PRO_MONTHLY_PRICE_USD}/month in this launch configuration and removes that browser-based cap.</p>
        </article>
        <article className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-white">Acceptable use</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">You agree not to use the service for unlawful, harmful, deceptive, or infringing activity. You remain responsible for reviewing and approving generated content before publishing it.</p>
        </article>
        <article className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-white">Support contact</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">Questions about billing or these terms can be sent to {siteConfig.email}. These terms are starter launch materials and should receive final business and legal review before broad commercial release.</p>
        </article>
      </section>
    </MarketingShell>
  );
}
