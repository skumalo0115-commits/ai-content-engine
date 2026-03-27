import { MarketingShell } from "@/app/components/MarketingShell";
import { PRO_MONTHLY_PRICE_USD, siteConfig } from "@/app/lib/site";

export default function TermsPage() {
  return (
    <MarketingShell>
      <section className="space-y-6 pt-8">
        <p className="editorial-label text-xs">Terms of Service</p>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-[#181614]">Starter terms for using {siteConfig.name}.</h1>
      </section>

      <section className="space-y-4">
        <article className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-[#181614]">Service access</h2>
          <p className="mt-3 text-sm leading-7 text-[#5f584f]">The app is provided on an as-available basis during this launch phase. Features, limits, and pricing may evolve as the product matures.</p>
        </article>
        <article className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-[#181614]">Free and Pro plans</h2>
          <p className="mt-3 text-sm leading-7 text-[#5f584f]">The free plan includes five total generations on a signed-in account. Pro is offered at ${PRO_MONTHLY_PRICE_USD}/month in this launch configuration and removes that limit.</p>
        </article>
        <article className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-[#181614]">Acceptable use</h2>
          <p className="mt-3 text-sm leading-7 text-[#5f584f]">You agree not to use the service for unlawful, harmful, deceptive, or infringing activity. You remain responsible for reviewing and approving generated content before publishing it.</p>
        </article>
        <article className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-[#181614]">Support contact</h2>
          <p className="mt-3 text-sm leading-7 text-[#5f584f]">Questions about billing or these terms can be sent to {siteConfig.email}. These terms are starter launch materials and should receive final business and legal review before broad commercial release.</p>
        </article>
      </section>
    </MarketingShell>
  );
}
