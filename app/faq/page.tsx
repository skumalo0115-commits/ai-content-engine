import { MarketingShell } from "@/app/components/MarketingShell";
import { faqItems } from "@/app/lib/site";

export default function FaqPage() {
  return (
    <MarketingShell>
      <section className="space-y-6 pt-8">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">FAQ</p>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white">Answers for the first-launch version of AI Content Engine.</h1>
      </section>

      <section className="space-y-4">
        {faqItems.map((item) => (
          <article key={item.question} className="glass-panel rounded-[28px] p-6">
            <h2 className="text-xl font-semibold text-white">{item.question}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{item.answer}</p>
          </article>
        ))}
      </section>
    </MarketingShell>
  );
}
