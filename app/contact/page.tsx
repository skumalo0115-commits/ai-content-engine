import { MarketingShell } from "@/app/components/MarketingShell";
import { siteConfig } from "@/app/lib/site";
import { FacebookIcon, GlobeIcon, LinkedInIcon, MailIcon, WhatsAppIcon } from "../components/Icons";

const contactItems = [
  { label: "WhatsApp", href: siteConfig.whatsappHref, icon: WhatsAppIcon, value: siteConfig.phoneDisplay },
  { label: "Email", href: `mailto:${siteConfig.email}`, icon: MailIcon, value: siteConfig.email },
  { label: "Facebook", href: siteConfig.facebookHref, icon: FacebookIcon, value: "IssUrSlime" },
  { label: "LinkedIn", href: siteConfig.linkedinHref, icon: LinkedInIcon, value: "Sbahle Kumalo" },
  { label: "Portfolio", href: siteConfig.portfolioHref, icon: GlobeIcon, value: "View portfolio" },
];

export default function ContactPage() {
  return (
    <MarketingShell>
      <div
        className="pointer-events-none fixed inset-0 -z-[9] bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-slide-1.png')" }}
      />
      <div className="pointer-events-none fixed inset-0 -z-[8] bg-[rgba(244,240,232,0.84)]" />
      <section className="space-y-6 pt-8">
        <p className="editorial-label text-xs">Contact</p>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-[#181614]">Reach out for launch questions, partnerships, or Pro support.</h1>
        <p className="max-w-3xl text-base leading-7 text-[#5f584f]">
          This first release is intentionally lean. If you need help configuring Stripe, OpenRouter, or your launch setup, the fastest contact path is WhatsApp or email.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {contactItems.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="glass-panel rounded-[28px] p-6 transition hover:border-[#20584f]/20 hover:bg-white"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e6efeb] text-[#20584f]">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-xl font-semibold text-[#181614]">{item.label}</h2>
              <p className="mt-2 text-sm text-[#5f584f]">{item.value}</p>
            </a>
          );
        })}
      </section>
    </MarketingShell>
  );
}
