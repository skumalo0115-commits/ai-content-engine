import { MarketingShell } from "@/app/components/MarketingShell";
import { siteConfig } from "@/app/lib/site";

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <section className="space-y-6 pt-8">
        <p className="editorial-label text-xs">Privacy Policy</p>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-[#181614]">Starter privacy terms for the launch version of {siteConfig.name}.</h1>
      </section>

      <section className="space-y-4">
        <article className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-[#181614]">What we collect</h2>
          <p className="mt-3 text-sm leading-7 text-[#5f584f]">We collect the prompt inputs you submit to generate content, plus limited technical information required to run the app, secure checkout, and improve reliability.</p>
        </article>
        <article className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-[#181614]">Payments</h2>
          <p className="mt-3 text-sm leading-7 text-[#5f584f]">Payments are handled by Stripe. We do not store your full card details on this site. Stripe may collect billing information as part of checkout and subscription management.</p>
        </article>
        <article className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-[#181614]">AI providers</h2>
          <p className="mt-3 text-sm leading-7 text-[#5f584f]">When live AI mode is enabled, prompt data may be sent to OpenRouter and the model provider needed to generate your requested content.</p>
        </article>
        <article className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-[#181614]">Contact</h2>
          <p className="mt-3 text-sm leading-7 text-[#5f584f]">Privacy questions can be sent to {siteConfig.email}. These launch documents are starter materials and should be reviewed again before wider public rollout.</p>
        </article>
      </section>
    </MarketingShell>
  );
}
