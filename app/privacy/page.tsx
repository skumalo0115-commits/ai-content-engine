import { MarketingShell } from "@/app/components/MarketingShell";
import { siteConfig } from "@/app/lib/site";

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <section className="space-y-6 pt-8">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Privacy Policy</p>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white">Starter privacy terms for the launch version of {siteConfig.name}.</h1>
      </section>

      <section className="space-y-4">
        <article className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-white">What we collect</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">We collect the prompt inputs you submit to generate content, plus limited technical information required to run the app, secure checkout, and improve reliability.</p>
        </article>
        <article className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-white">Payments</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">Payments are handled by Stripe. We do not store your full card details on this site. Stripe may collect billing information as part of checkout and subscription management.</p>
        </article>
        <article className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-white">AI providers</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">When live AI mode is enabled, prompt data may be sent to OpenRouter and the model provider needed to generate your requested content.</p>
        </article>
        <article className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-white">Contact</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">Privacy questions can be sent to {siteConfig.email}. These launch documents are starter materials and should be reviewed again before wider public rollout.</p>
        </article>
      </section>
    </MarketingShell>
  );
}
