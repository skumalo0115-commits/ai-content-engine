import Link from "next/link";
import { contactLinks, footerPageLinks, siteConfig } from "@/app/lib/site";
import { FacebookIcon, GlobeIcon, LinkedInIcon, MailIcon, WhatsAppIcon } from "./Icons";

const iconMap = {
  WhatsApp: WhatsAppIcon,
  Facebook: FacebookIcon,
  LinkedIn: LinkedInIcon,
  Portfolio: GlobeIcon,
  Email: MailIcon,
} as const;

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/45">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">{siteConfig.shortName}</p>
          <h2 className="max-w-md text-2xl font-semibold text-white">Launch social content faster with a free daily workflow and a clean Pro upgrade path.</h2>
          <p className="max-w-xl text-sm leading-6 text-slate-400">{siteConfig.pricingBlurb}</p>
          <div className="flex flex-wrap gap-3">
            {contactLinks.map((link) => {
              const Icon = iconMap[link.label as keyof typeof iconMap];

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("/") ? undefined : "_blank"}
                  rel={link.href.startsWith("/") ? undefined : "noreferrer"}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-300/30 hover:text-cyan-100"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-white">Company</p>
          <div className="flex flex-col gap-2 text-sm text-slate-400">
            {footerPageLinks.map((link) => (
              <Link key={link.label} href={link.href} className="transition hover:text-cyan-100">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-400">
          <p className="font-semibold text-white">Launch Contact</p>
          <p>{siteConfig.email}</p>
          <a href={siteConfig.phoneHref} className="block transition hover:text-cyan-100">
            {siteConfig.phoneDisplay}
          </a>
          <p>USD pricing. Free tier included. Stripe-powered Pro checkout ready for launch.</p>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {siteConfig.companyName}. All rights reserved.</p>
          <p>Launch beta terms apply. Legal pages are starter documents pending final review.</p>
        </div>
      </div>
    </footer>
  );
}
