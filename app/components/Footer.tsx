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
    <footer className="border-t border-black/6 bg-[#f8f5ef]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.9fr]">
        <div className="space-y-4">
          <p className="editorial-label text-xs">{siteConfig.shortName}</p>
          <h2 className="max-w-md text-2xl font-semibold text-[#181614]">Clean content systems for small businesses that want to look sharp without looking chaotic.</h2>
          <p className="max-w-xl text-sm leading-6 text-[#6f685f]">{siteConfig.pricingBlurb}</p>
          <div className="flex flex-wrap gap-3">
            {contactLinks.map((link) => {
              const Icon = iconMap[link.label as keyof typeof iconMap];

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("/") ? undefined : "_blank"}
                  rel={link.href.startsWith("/") ? undefined : "noreferrer"}
                  className="interactive-pop inline-flex items-center gap-2 rounded-full border border-black/6 bg-white px-3 py-2 text-sm text-[#4d463f] hover:border-[#20584f]/20 hover:text-[#181614]"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#181614]">Company</p>
          <div className="flex flex-col gap-2 text-sm text-[#6f685f]">
            {footerPageLinks.map((link) => (
              <Link key={link.label} href={link.href} className="footer-link-pop transition hover:text-[#181614]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3 text-sm text-[#6f685f]">
          <p className="font-semibold text-[#181614]">Launch Contact</p>
          <p>{siteConfig.email}</p>
          <a href={siteConfig.phoneHref} className="footer-link-pop -ml-2 inline-block transition hover:text-[#181614]">
            {siteConfig.phoneDisplay}
          </a>
          <p>Need help choosing a plan or setting up your first content brief? Reach out and we&apos;ll point you in the right direction.</p>
        </div>
      </div>

      <div className="border-t border-black/6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-[#7a7269] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>&copy; {new Date().getFullYear()} {siteConfig.companyName}. All rights reserved.</p>
          <p>Starter launch documents and support links are included for first release use.</p>
        </div>
      </div>
    </footer>
  );
}
